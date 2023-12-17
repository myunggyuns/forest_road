import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  healthCheck() {
    return 'hello world';
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Request() req: Request) {
    const { body } = req;
    const user = await this.userService.signup(body);
    return { data: user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Request() req: Request) {
    const { body } = req;
    const user = await this.userService.signin(body);
    return { data: user };
  }

  @Post('gen-token')
  getToken() {
    return this.userService.getToken();
  }
}
