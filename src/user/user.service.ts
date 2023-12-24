import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
      newUser.uuid = uuidv4();
      // const payload = { sub: body.email, username: body.nickName };
      // const access_token = await this.jwtService.signAsync(payload);
      newUser.password = '';
      await this.userRepository.save(newUser);
      return newUser;
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

  async getRepository() {
    return this.userRepository;
  }
}
