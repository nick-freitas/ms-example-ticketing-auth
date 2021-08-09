import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './validators/create-user-dto.validator';

@Controller('api/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('currentuser')
  getCurrentUser(): string {
    return this.appService.getCurrentUser();
  }

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto): any {
    const { email, password } = createUserDto;
    if (!email || !password)
      throw new BadRequestException('email or password is not defined');

    return this.appService.signUp(email, password);
  }

  @Post('signin')
  signIn(): any {
    return this.appService.signIn();
  }

  @Post('signout')
  signOut(): any {
    return this.appService.signOut();
  }
}
