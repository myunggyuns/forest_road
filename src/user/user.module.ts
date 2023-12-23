import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from 'src/database/entity/user/user.providers';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: 'salt',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [UserService, ...userProviders],
  controllers: [UserController],
})
export class UserModule {}
