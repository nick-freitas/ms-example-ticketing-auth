import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Response,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './validators/create-user-dto.validator';

@Controller('api/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto): any {
    const { email, password } = createUserDto;
    if (!email || !password)
      throw new BadRequestException('email or password is not defined');

    return this.appService.signUp(email, password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@Request() req, @Res({ passthrough: true }) response: Response): any {
    const { access_token } = this.appService.signIn(req.user);
    (response as any)?.cookie('access_token', access_token);

    return { access_token };
  }

  @Post('signout')
  signOut(): any {
    return this.appService.signOut();
  }
}
