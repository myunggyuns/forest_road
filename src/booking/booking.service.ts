import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Booking } from 'src/database/entity/booking/booking.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('BOOKING_REPOSITORY')
    private bookingRepository: Repository<Booking>,
  ) {}

  async list() {
    try {
      const concertList = await this.bookingRepository.find();
      return concertList;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async concertDate(id: string) {
    const concertList = await this.bookingRepository.findOneBy({
      id: Number(id),
    });
    return concertList;
  }

  async concertSeat(concertId: string, date: string) {
    const result = await this.bookingRepository.findOneBy({
      id: Number(concertId),
    });
    if (result && result.date_list) {
      const seatList = result.date_list.filter((value) => value.date === date);
      return seatList[0].seat_list;
    }
  }

  booking() {}

  async createConcert(body) {
    const { title, date_list, singer } = body;
    const concert = new Booking();
    concert.title = title;
    concert.date_list = date_list;
    concert.singer = singer;
    const saveConcert = await this.bookingRepository.save(concert);
    return saveConcert;
  }
}
