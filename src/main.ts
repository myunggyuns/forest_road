import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
import { AppModule } from './app.module';
import { LoggerService } from './service/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  try {
    const configService = app.get(ConfigService);
    // const jwtService = app.get(JwtService);
    await app.listen(configService.get<number>('PORT'), () => {
      logger.log(
        `Server is Starting!! ${configService.get<number>('PORT')}`,
        'Server Start',
      );
    });
  } catch (error) {
    logger.error('Server start Error', 'Init', 'Bootstrap');
  }
}
bootstrap();
