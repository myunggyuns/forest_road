import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/database/entity/user/user.entity';
import { DatabaseSource } from '@/database/index';
import { LoggerService } from '@/service/logger/logger.service';

/**
 * TODO
 * redis 연동해서 솔티드 셋으로 구현을 한다.
 * 대기열 큐와 room 큐를 만들어서 관리를 한다.
 * client에서 폴링을 받으면 redis에서 대기열 큐로 체크, 현재 순서를 알려준다.
 * room에서 사람이 빠지면 대기열에서 사람을 넣는다.
 * room 안에 들어올때 user 토큰을 확인해서 유효한 토큰인지 확인한다.
 * 유효한 토큰이면 결제를 가능하도록 user token을 새로 발급한다.(5분만 이용가능한)
 * 5분이후에 클라이언트에서 api 호출을 보낸다.
 */
export class RoomManager extends DatabaseSource {
  room: Map<string, User>;
  configService: ConfigService;
  jwtService: JwtService;
  waitingQueue: User[];
  waitIndex: number;
  logger: LoggerService;

  constructor(
    configService: ConfigService,
    jwtServcie: JwtService,
    logger: LoggerService,
  ) {
    super();
    this.room = new Map();
    this.configService = configService;
    this.jwtService = jwtServcie;
    this.waitingQueue = [];
    this.waitIndex = 0;
    this.logger = logger;
  }

  private async joinRoom(user) {
    this.logger.log(`User enter joinRoom user.uuid: ${user.uuid}`, 'joinRoom');
    const time = new Date();
    const payload = { uuid: user.uuid, time };
    const userToken = await this.jwtService.signAsync(payload);
    const userRepo = this.dataSource.getRepository(User);
    try {
      await userRepo.update(
        { uuid: user.uuid },
        { status: 'work', user_token: userToken },
      );
      const updateUser = await userRepo.findOneBy({ uuid: user.uuid });
      this.room.set(user.uuid, updateUser);
      // console.log(this.room);
    } catch (error) {
      this.logger.error(error.message, 'joinRoom');
    }
  }

  async leaveRoom(user) {
    if (this.room.has(user.uuid)) {
      this.room.delete(user.uuid);
      await this.dataSource
        .getRepository(User)
        .update({ uuid: user.uuid }, { status: 'done', user_token: '' });
      if (this.waitingQueue.length) {
        const queueUser = this.waitingQueue.shift();
        this.joinRoom(queueUser);
      }
    }
  }

  public async joinQueue(user) {
    const time = new Date();
    this.waitIndex++;
    this.logger.log(
      `User enter joinQueue user.uuid: ${user.uuid}`,
      'joinQueue',
    );
    const payload = { uuid: user.uuid, time, waitIndex: this.waitIndex };
    const userToken = await this.jwtService.signAsync(payload);
    const userRepo = this.dataSource.getRepository(User);
    await userRepo.update(
      { uuid: user.uuid },
      { user_token: userToken, status: 'wait' },
    );
    const updateUser = await userRepo.findOneBy({ uuid: user.uuid });
    const size = this.configService.get('ROOM_SIZE');
    this.waitingQueue.push(updateUser);
    // console.log(this.waitingQueue);
    if (this.room.size < Number(size)) {
      const queueUser = this.waitingQueue.shift();
      this.joinRoom(queueUser);
      this.waitIndex--;
    }
  }

  async getRoomStatus(email) {
    const user = await this.dataSource.getRepository(User).findOneBy({ email });
    let waitLine = 0;
    this.waitingQueue.forEach((value) => {
      if (user.uuid === value.uuid) {
        const payload = this.jwtService.decode(value.user_token);
        waitLine = Number(payload.waitIndex);
      }
    });
    if (waitLine) {
      this.logger.debug(
        `Get Room wait line user.uuid: ${user.uuid}`,
        'RoomStatus',
      );
      return waitLine.toString();
    } else {
      this.logger.debug(
        `exist in the room user.uuid: ${user.uuid}`,
        'RoomStatus',
      );
      return 'exist in the room';
    }
  }

  private async payment() {}
}
