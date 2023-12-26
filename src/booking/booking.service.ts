import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Booking } from '@/database/entity/booking/booking.entity';
import { DataSource } from 'typeorm';
import { RoomManager } from '@/service/room';
import { User } from '@/database/entity/user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BookingService extends RoomManager {
  constructor(
    readonly configService: ConfigService,
    readonly jwtService: JwtService,
    readonly dataSource: DataSource,
  ) {
    super(configService, jwtService, dataSource);
  }

  async concertList() {
    try {
      const concertList = await this.dataSource.getRepository(Booking).find();
      return concertList;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async concertDate(id: string) {
    const concertList = await this.dataSource.getRepository(Booking).findOneBy({
      id: Number(id),
    });
    return concertList;
  }

  async concertSeat(concertId: string, date: string) {
    const result = await this.dataSource.getRepository(Booking).findOneBy({
      id: Number(concertId),
    });
    if (result && result.date_list) {
      const seatList = result.date_list.filter((value) => value.date === date);
      return seatList[0].seat_list;
    }
  }

  async booking(body) {
    const { email } = body;
    const user = await this.dataSource.getRepository(User).findOneBy({ email });
    if (!this.room.has(user.uuid)) {
      await this.joinQueue(user);
    } else {
      return 'Already join room!';
    }
  }

  async roomStatus(body) {
    const { email } = body;
    return await this.getRoomStatus(email);
  }

  async createConcert(body) {
    const { title, date_list, singer } = body;
    const concert = new Booking();
    concert.title = title;
    concert.date_list = date_list;
    concert.singer = singer;
    const saveConcert = await this.dataSource
      .getRepository(Booking)
      .save(concert);
    return saveConcert;
  }
}
