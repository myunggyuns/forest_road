import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // console.log('!!!!!!!!! Running Port: ', configService.get<number>('PORT'));
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
