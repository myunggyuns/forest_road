import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DatabaseModule } from '@/database/database.module';
import { User } from '@/database/entity/user/user.entity';
// import { userProviders } from '@/database/entity/user/user.providers';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/service/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'salt',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
