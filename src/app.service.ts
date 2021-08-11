import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async getCurrentUser(id: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findById(id, {
      email: 1,
      id: 1,
    });

    return user;
  }

  async signUp(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const user = await this.userModel.create({ email, password });
    if (!user) {
      throw new InternalServerErrorException('Could not create user');
    }

    return this.signIn(await this.validateUser(email, password));
  }

  signIn(user: UserDocument): { access_token: string } {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  signOut(): any {
    return {};
  }

  async validateUser(email: string, pass: string): Promise<UserDocument> {
    const user = await this.userModel.findOne(
      { email },
      { email: 1, password: 1, id: 1 },
    );
    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }

    const matched = await bcrypt.compare(pass, user?.password);
    if (!matched) {
      throw new UnauthorizedException('Invalid Password');
    }

    return user;
  }
}
