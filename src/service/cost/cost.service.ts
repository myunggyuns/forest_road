import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Cost } from '@/database/entity/cost/cost.entity';

@Injectable()
export class CostService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('COST_REPOSITORY') private costRepository: Repository<Cost>,
  ) {}

  async remainCost() {
    const cost = await this.costRepository.find();
    return cost;
  }

  async payment(body) {
    const { amount } = body;
    const result = await this.costRepository.update({ cost_id: 1 }, { amount });
    console.log(result.affected);
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
