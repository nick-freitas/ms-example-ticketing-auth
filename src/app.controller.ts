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
import { SignInDtoValidator } from './validators/sign-in.dto-validator';
import { SignUpDtoValidator } from './validators/sign-up.dto-validator';

@Controller('api/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    if (!req?.user?.userId) throw new BadRequestException('No userId present');
    return this.appService.getCurrentUser(req?.user?.userId);
  }

  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDtoValidator,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { email, password } = signUpDto;
    if (!email || !password)
      throw new BadRequestException('email or password is not defined');

    const { access_token } = await this.appService.signUp(email, password);
    (response as any)?.cookie('access_token', access_token);

    return { access_token };
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDtoValidator,
  ): any {
    const { access_token } = this.appService.signIn(req.user);
    (response as any)?.cookie('access_token', access_token);

    return { access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  signOut(@Request() req, @Res({ passthrough: true }) response: Response): any {
    (response as any)?.clearCookie('access_token');
    return;
  }
}
