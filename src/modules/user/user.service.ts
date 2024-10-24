import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/database/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const password = this.hashPassword(createUserDto.password);

    const user = new this.userModel({
      username: createUserDto.username,
      password: password,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      address: createUserDto.address,
    });
    const savedUser = await user.save();
    const token = await this.obtainToken(user._id.toString(), user.email);
    delete savedUser.password
    return {
      user: savedUser,
      ...token,
    }
  }


  /**
   * Authenticates a user with the provided credentials.
   *
   * @param createUserDto - The data transfer object containing user credentials.
   * @returns A promise that resolves to an object containing the authenticated user and a JWT token.
   * @throws ForbiddenException if the user is not found or the password is incorrect.
   */
  async signIn(createUserDto: AuthDto) {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (!user) {
      throw new ForbiddenException("Invalid Credentials");
    }
    const isMatch = await this.verifyHashed(user.password, createUserDto.password);
    if (!isMatch) {
      throw new ForbiddenException("Invalid Credentials");
    }
    const token = await this.obtainToken(user._id.toString(), user.email);
    delete user.password
    return {
      user: user,
      ...token,
    };
  }
  /**
   * Verifies if a given string matches the hashed value.
   *
   * @param hashedValue - The hashed value to compare against.
   * @param stringValue - The plaintext string to verify.
   * @returns A boolean indicating if the string matches the hashed value.
   * @throws ForbiddenException if the verification fails.
   */
  async verifyHashed(
    hashedValue: string,
    stringValue: string,
  ) {
    const isMatch = await argon2.verify(hashedValue, stringValue);
    if (!isMatch) {
      throw new ForbiddenException("Invalid Credentials");
    }
    return isMatch
  }
  
  /**
   * Return Hashed String With Agron
   * @param data
   */
  async hashPassword(data: string) {
    return await argon2.hash(data);
  }
  /**
   * Returns an object with access_token and refresh_token.
   *
   * The access_token is a JWT token that is valid for 30 minutes.
   * The refresh_token is a JWT token that is valid for 7 days.
   *
   * @param id - The unique identifier for the user.
   * @param email - The email address of the user.
   * @returns A promise that resolves to an object with access_token and refresh_token.
   */

  async obtainToken(id: string, email: string) {
    const payload = { sub: id, email };
    const secret = this.configService.get('SECRET_KEY');
    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: '30m',
        secret: secret,
      }),
    };
  }
}
