import { Controller, Post } from '@nestjs/common';
import { UserService } from '../../services/user/user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('signup')
  signup() {
    return this.userService.signup();
  }

  @Post('signin')
  signin() {
    return this.userService.signin();
  }

  @Post('gen-token')
  getToken() {
    return this.userService.getToken();
  }
}
