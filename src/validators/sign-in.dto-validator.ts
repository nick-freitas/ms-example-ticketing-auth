import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInDtoValidator {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;
}
