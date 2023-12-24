import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // const jwtService = app.get(JwtService);
  await app.listen(configService.get<number>('PORT'), () => {
    console.log(`Server is Starting!!`);
  });
}
bootstrap();
