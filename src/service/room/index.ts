import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/database/entity/user/user.entity';
import { DatabaseSource } from '@/database';

export class RoomManager extends DatabaseSource {
  room: Map<string, User>;
  configService: ConfigService;
  jwtService: JwtService;
  waitingQueue: User[];
  waitIndex: number;

  constructor(configService: ConfigService, jwtServcie: JwtService) {
    super();
    this.room = new Map();
    this.configService = configService;
    this.jwtService = jwtServcie;
    this.waitingQueue = [];
    this.waitIndex = 0;
  }

  private async joinRoom(user) {
    const time = new Date();
    const payload = { uuid: user.uuid, time };
    const userToken = await this.jwtService.signAsync(payload);
    const userRepo = this.dataSource.getRepository(User);
    await userRepo.update(
      { uuid: user.uuid },
      { status: 'work', user_token: userToken },
    );
    const updateUser = await userRepo.findOneBy({ uuid: user.uuid });
    this.room.set(user.uuid, updateUser);
    // console.log(this.room);
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
    console.log(this.room, this.waitingQueue);
    if (waitLine) {
      return waitLine.toString();
    } else {
      return 'exist in the room';
    }
  }

  async payment() {}
}
