import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Matches } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;
  
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password must be at least 8 characters long and contain at least one letter and one number',
  })
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

}