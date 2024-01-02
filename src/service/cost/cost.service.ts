import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  ) {
    super(configService, jwtService, logger);
  }

  async remainCost() {
    const cost = await this.dataSource.getRepository(User).find();
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
      this.logger.warn('Invalid Token', 'payment');
    }

    if (this.room.has(user.uuid)) {
      try {
        const result = await this.dataSource
          .getRepository(Cost)
          .update({ cost_id: 1 }, { amount });
        if (result) {
        }
      } catch (error) {
        this.logger.error(error.message, 'payment');
      }
    } else {
      this.logger.warn('Not exist User in the Room', 'payment');
    }

    return await this.dataSource.getRepository(Cost).find();
  }

  async charge(body) {
    const { amount, booking_date, booking_seat_num } = body;
    const cost = new Cost();
    cost.amount = amount;
    cost.booking_date = booking_date;
    cost.booking_seat_num = booking_seat_num;
    const saveCost = await this.dataSource.getRepository(Cost).save(cost);
    return saveCost;
  }

  async createCharge(body) {
    const { amount, booking_date, booking_seat_num } = body;
    const cost = new Cost();
    cost.amount = amount;
    cost.booking_date = booking_date;
    cost.booking_seat_num = booking_seat_num;
    const saveCost = await this.dataSource.getRepository(Cost).save(cost);
    return saveCost;
  }
}
