import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Cost } from '@/database/entity/cost/cost.entity';
import { RoomManager } from '../room';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';
import { User } from '@/database/entity/user/user.entity';
import * as moment from 'moment';

@Injectable()
export class CostService extends RoomManager {
  constructor(
    readonly configService: ConfigService,
    readonly jwtService: JwtService,
    readonly logger: LoggerService,
    @Inject('COST_REPOSITORY') private costRepository: Repository<Cost>,
  ) {
    super(configService, jwtService, logger);
  }

  async remainCost() {
    const cost = await this.costRepository.find();
    return cost;
  }

  async payment(body) {
    const { amount, email } = body;
    const user = await this.dataSource.getRepository(User).findOneBy({ email });
    const payload = this.jwtService.decode(user.user_token);
    const time = moment();
    const diffTime = time.diff(payload.time, 'minutes');

    if (diffTime >= 5) {
      this.leaveRoom(user);
    }

    if (this.room.has(user.uuid)) {
      const result = await this.costRepository.update(
        { cost_id: 1 },
        { amount },
      );
      if (result) {
      }
    } else {
    }

    return await this.costRepository.find();
  }

  async charge(body) {
    const { amount, booking_date, booking_seat_num } = body;
    const cost = new Cost();
    cost.amount = amount;
    cost.booking_date = booking_date;
    cost.booking_seat_num = booking_seat_num;
    const saveCost = await this.costRepository.save(cost);
    return saveCost;
  }

  async createCharge(body) {
    const { amount, booking_date, booking_seat_num } = body;
    const cost = new Cost();
    cost.amount = amount;
    cost.booking_date = booking_date;
    cost.booking_seat_num = booking_seat_num;
    const saveCost = await this.costRepository.save(cost);
    return saveCost;
  }
}
