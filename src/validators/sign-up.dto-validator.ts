import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDtoValidator {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;
}
