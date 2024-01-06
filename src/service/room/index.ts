import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/database/entity/user/user.entity';
import { DatabaseSource } from '@/database/index';
import { LoggerService } from '@/service/logger/logger.service';
import * as moment from 'moment';
import { RedisService } from '../redis/redis.service';

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
  waitIndex: number;
  logger: LoggerService;
  redis: RedisService;

  constructor(
    configService: ConfigService,
    jwtServcie: JwtService,
    logger: LoggerService,
    redis: RedisService,
  ) {
    super();
    this.room = new Map();
    this.configService = configService;
    this.jwtService = jwtServcie;
    this.waitIndex = 0;
    this.logger = logger;
    this.redis = redis;
  }

  public async joinQueue(user) {
    this.waitIndex++;
    this.logger.log(
      `User enter joinQueue user.uuid: ${user.uuid}`,
      'joinQueue',
    );
    try {
      const size = this.configService.get('ROOM_SIZE');
      await this.redis.zAdd('joinQueue', this.waitIndex, JSON.stringify(user));
      if (this.room.size < Number(size)) {
        const index = await this.redis.zRank('joinQueue', JSON.stringify(user));
        const list = await this.redis.zRange('joinQueue');
        const queuedUser = JSON.parse(list[index]);
        await this.redis.zRem('joinQueue', JSON.stringify(user));
        this.joinRoom(queuedUser);
      }
    } catch (error) {
      this.logger.error(error.message, 'joinQueue');
    }
  }

  private async joinRoom(user) {
    this.logger.log(`User enter joinRoom user.uuid: ${user.uuid}`, 'joinRoom');
    const time = moment().format('yyyy-mm-dd hh:mm:ss');
    const payload = { uuid: user.uuid, time };
    const userToken = await this.jwtService.signAsync(payload);
    const updateUser = {
      ...user,
      userToken,
    };
    try {
      this.room.set(user.uuid, updateUser);
    } catch (error) {
      this.logger.error(error.message, 'joinRoom');
    }
  }

  async leaveRoom(user) {
    this.logger.log(
      `User leave leaveRoom user.uuid: ${user.uuid}`,
      'leaveRoom',
    );
    if (this.room.has(user.uuid)) {
      this.room.delete(user.uuid);
      try {
      } catch (error) {
        this.logger.error(error.message, 'leaveRoom');
      }
    } else {
      this.logger.warn(`Not exist User in the room ${user.uuid}`, 'leaveRoom');
    }
  }

  async releaseRoom() {}

  async getWaittingStatus(email) {
    const user = await this.dataSource.getRepository(User).findOneBy({ email });

    const waitLine =
      (await this.redis.zRank('joinQueue', JSON.stringify(user))) + 1;

    if (waitLine) {
      this.logger.log(
        `Get Room wait line user.uuid: ${user.uuid}`,
        'RoomStatus',
      );
      return waitLine.toString();
    } else if (waitLine === null) {
      this.logger.log(
        `exist in the room user.uuid: ${user.uuid}`,
        'RoomStatus',
      );
    } else {
      this.logger.log(
        `exist in the room user.uuid: ${user.uuid}`,
        'RoomStatus',
      );
      return 'exist in the room';
    }
  }
}
