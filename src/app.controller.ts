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
import { CreateUserDto } from './validators/create-user-dto.validator';

@Controller('api/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req?.user);
    if (!req?.user?.userId) throw new BadRequestException('No userId present');
    return this.appService.getCurrentUser(req?.user?.userId);
  }

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { email, password } = createUserDto;
    if (!email || !password)
      throw new BadRequestException('email or password is not defined');

    const { access_token } = await this.appService.signUp(email, password);
    (response as any)?.cookie('access_token', access_token);

    return { access_token };
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
