import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/database/entity/user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseSource } from '@/database';

@Injectable()
export class UserService extends DatabaseSource {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async signup(body) {
    if (!body.nickName || !body.email || !body.password) {
      throw new UnauthorizedException();
    }

    const callback = async () => {
      const user = await this.dataSource
        .getRepository(User)
        .findOneBy({ email: body.email });

      if (!user) {
        const newUser = new User();
        // const cost = new Cost();
        newUser.email = body.email;
        newUser.password = body.password;
        newUser.nickname = body.nickName;
        newUser.uuid = uuidv4();
        // cost.amount = 20000;
        // newUser.cost = cost;
        // const payload = { sub: body.email, username: body.nickName };
        // const access_token = await this.jwtService.signAsync(payload);
        newUser.password = '';
        return newUser;
      } else {
        throw new ConflictException('Exist User');
      }
    };

    return await this.transaction(callback, true);
  }

  async signin(body) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException();
    }

    const callback = async () => {
      const user = await this.dataSource
        .getRepository(User)
        .findOneBy({ email: body.email });

      // const payload = { sub: user.email, username: user.nickname };
      // const access_token = await this.jwtService.signAsync(payload);

      if (user) {
        return user;
      } else {
        return 'Invalid User';
      }
    };
    return await this.transaction(callback, false);
  }

  // async generateUserToken(body) {
  //   const time = new Date();
  //   const payload = { email: body.email, time: time };
  //   const userToken = await this.jwtService.signAsync(payload);
  //   return userToken;
  // }

  // async getRepository() {
  //   return this.userRepository;
  // }

  async findAll() {
    return await this.dataSource.getRepository(User).find();
  }
}
