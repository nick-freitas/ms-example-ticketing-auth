import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getHello(): string {
    return 'Hello World!';
  }

  getCurrentUser(): string {
    return 'Hi there';
  }

  async signUp(email: string, password: string): Promise<any> {
    const user = await this.userModel.create(email, password);

    return user;
  }

  signIn(): any {
    return { email: '', password: '' };
  }

  signOut(): any {
    return {};
  }
}
