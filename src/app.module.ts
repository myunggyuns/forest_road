import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../env/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { CostModule } from './cost/cost.module';
import { UserModule } from './user/user.module';
// import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/.${process.env.NODE_ENV}.env`,
      validate,
    }),
    UserModule,
    BookingModule,
    CostModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}

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
