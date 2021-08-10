import * as bcrypt from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await bcrypt.hash(this.get('password'), 12);
    this.set('password', hashed);
  }

  done();
});
