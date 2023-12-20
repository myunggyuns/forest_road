import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Booking } from 'src/entity/booking/booking.entity';
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
      console.log(error)
      return error;
    }
  }

  async concertDate(id: string) {
    const concertList = await this.bookingRepository.findOneBy({
      id: Number(id),
    });
    const dateList = JSON.parse(concertList.date_list);
    const list = [];
    dateList.forEach((value) => {
      list.push(value['date']);
    });
    return list;
  }

  async concertSeat(concertId: string, date: string) {
    const result = await this.bookingRepository.findOneBy({id: Number(concertId)});
  }

  booking() {}

  async createConcert(body) {
    const { title, date_list, seat_list, singer } = body;
    const concert = new Booking();
    concert.title = title;
    concert.date_list = JSON.stringify(date_list);
    concert.seat_list = ['1', '2'];
    concert.singer = singer;
    const saveConcert = await this.bookingRepository.save(concert);
    return saveConcert;
  }
}
