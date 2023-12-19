import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {}

  async signup(body) {
    if (!body.nickName || !body.email || !body.password) {
      return new Error('Invalid User');
    }

    const user = await this.userRepository.findOneBy({ email: body.email });
    if (!user) {
      const newUser = new User();
      newUser.email = body.email;
      newUser.password = body.password;
      newUser.nickname = body.nickName;
      return await this.userRepository.save(newUser);
    } else {
      return 'Exist User';
    }
  }

  async signin(body) {
    if (!body.email || !body.password) {
      return new Error('Invalid User');
    }
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (user) {
      return user;
    } else {
      return 'Invalid User';
    }
  }

  getToken() {}
}
