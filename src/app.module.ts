import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../env/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/.${process.env.NODE_ENV}.env`,
      validate,
    }),
    UserModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
