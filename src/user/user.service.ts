import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entity/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(body) {
    if (!body.nickName || !body.email || !body.password) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({ email: body.email });
    if (!user) {
      const newUser = new User();
      newUser.email = body.email;
      newUser.password = body.password;
      newUser.nickname = body.nickName;
      // const payload = { sub: body.email, username: body.nickName };
      // const access_token = await this.jwtService.signAsync(payload);
      // await this.userRepository.save(newUser);
      newUser.password = '';
      const userInfo = { ...newUser };
      return userInfo;
    } else {
      return 'Exist User';
    }
  }

  async signin(body) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findOneBy({ email: body.email });
    // const payload = { sub: user.email, username: user.nickname };
    // const access_token = await this.jwtService.signAsync(payload);

    if (user) {
      return user;
    } else {
      return 'Invalid User';
    }
  }

  async generateUserToken(body) {
    const time = new Date();
    const payload = { email: body.email, time: time };
    const userToken = await this.jwtService.signAsync(payload);
    return userToken;
  }
}
