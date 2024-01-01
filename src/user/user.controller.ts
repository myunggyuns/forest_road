import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from '../service/user/user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // healthCheck() {
  //   return 'hello world';
  // }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Request() req: Request) {
    const { body } = req;
    return await this.userService.signup(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Request() req: Request) {
    const { body } = req;
    return await this.userService.signin(body);
  }

  // @Post('gen-user-token')
  // generateUserToken(@Request() req: Request) {
  // const { body } = req;
  // return this.userService.generateUserToken(body);
  // }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
