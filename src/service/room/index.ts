import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user/user.entity';
import { DataSource, Repository } from 'typeorm';

export class RoomManager {
  room: Map<string, User>;
  configService: ConfigService;
  jwtService: JwtService;
  waitingQueue: User[];
  userRepo: Repository<User>;
  waitIndex: number;

  constructor(
    configService: ConfigService,
    jwtServcie: JwtService,
    dataSource: DataSource,
  ) {
    this.room = new Map();
    this.configService = configService;
    this.jwtService = jwtServcie;
    this.userRepo = dataSource.getRepository(User);
    this.waitingQueue = [];
    this.waitIndex = 0;
  }

  private async joinRoom(user) {
    const time = new Date();
    const payload = { uuid: user.uuid, time };
    const userToken = await this.jwtService.signAsync(payload);
    await this.userRepo.update(
      { uuid: user.uuid },
      { status: 'work', user_token: userToken },
    );
    const updateUser = await this.userRepo.findOneBy({ uuid: user.uuid });
    this.room.set(user.uuid, updateUser);
    // console.log(this.room);
  }

  async leaveRoom(user) {
    if (this.room.has(user.uuid)) {
      this.room.delete(user.uuid);
      await this.userRepo.update(
        { uuid: user.uuid },
        { status: 'done', user_token: '' },
      );
      if (this.waitingQueue.length) {
        const queueUser = this.waitingQueue.shift();
        this.joinRoom(queueUser);
      }
    }
  }

  public async joinQueue(user) {
    const time = new Date();
    this.waitIndex++;
    const payload = { uuid: user.uuid, time, waitIndex: this.waitIndex };
    const userToken = await this.jwtService.signAsync(payload);
    await this.userRepo.update(
      { uuid: user.uuid },
      { user_token: userToken, status: 'wait' },
    );
    const updateUser = await this.userRepo.findOneBy({ uuid: user.uuid });
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
    const user = await this.userRepo.findOneBy({ email });
    let waitLine = 0;
    this.waitingQueue.forEach((value) => {
      if (user.uuid === value.uuid) {
        const payload = this.jwtService.decode(value.user_token);
        waitLine = Number(payload.waitIndex);
      }
    });
    if (waitLine) {
      return waitLine.toString();
    } else {
      return 'exist in the room';
    }
  }
}
