import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../env/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { CostModule } from './cost/cost.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './database/entity/user/user.entity';
import { Booking } from './database/entity/booking/booking.entity';
import { Cost } from './database/entity/cost/cost.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/.${process.env.NODE_ENV}.env`,
      validate,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'test',
      entities: [User, Booking, Cost],
      synchronize: true,
    }),
    UserModule,
    BookingModule,
    CostModule,
    RoomModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

/**
 *     // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '12345678',
    //   database: 'test',
    //   entities: [],
    //   synchronize: true,
    // }),
 */
