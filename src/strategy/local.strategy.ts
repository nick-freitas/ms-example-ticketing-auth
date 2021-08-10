import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppService } from '../app.service';
import { UserDocument } from '../schema/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private appService: AppService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserDocument> {
    const user = await this.appService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }

    return user;
  }
}
