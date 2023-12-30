import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Booking } from '@/database/entity/booking/booking.entity';
import { RoomManager } from '@/service/room';
import { User } from '@/database/entity/user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BookingService extends RoomManager {
  constructor(
    readonly configService: ConfigService,
    readonly jwtService: JwtService,
  ) {
    super(configService, jwtService);
  }

  async concertList() {
    const callback = async () => {
      return await this.dataSource.getRepository(Booking).find();
    };

    return await this.transaction(callback, false);
  }

  async concertDate(id: string) {
    const callback = async () => {
      await this.dataSource.getRepository(Booking).findOneBy({
        id: Number(id),
      });
    };

    return await this.transaction(callback, false);
  }

  async concertSeat(concertId: string, date: string) {
    const callback = async () => {
      const result = await this.dataSource.getRepository(Booking).findOneBy({
        id: Number(concertId),
      });
      if (result && result.date_list) {
        const seatList = result.date_list.filter(
          (value) => value.date === date,
        );
        return seatList[0].seat_list;
      }
    };
    return await this.transaction(callback, false);
  }

  async booking(body) {
    const callback = async () => {
      const { email } = body;
      const user = await this.dataSource
        .getRepository(User)
        .findOneBy({ email });
      if (!this.room.has(user.uuid)) {
        await this.joinQueue(user);
      } else {
        return 'Already join room!';
      }
    };
    return await this.transaction(callback, false);
  }

  async roomStatus(body) {
    const callback = async () => {
      const { email } = body;
      return await this.getRoomStatus(email);
    };

    return await this.transaction(callback, false);
  }

  async createConcert(body) {
    const callback = async () => {
      const { title, date_list, singer } = body;
      const concert = new Booking();
      concert.title = title;
      concert.date_list = date_list;
      concert.singer = singer;
      const saveConcert = await this.dataSource
        .getRepository(Booking)
        .save(concert);
      return saveConcert;
    };
    return await this.transaction(callback, true);
  }
}
