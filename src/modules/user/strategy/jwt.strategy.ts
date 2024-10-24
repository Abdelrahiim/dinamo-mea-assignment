import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }
  /**
   * Validates the JWT payload by retrieving the associated user from the database.
   *
   * @param payload - An object containing the JWT payload with user identifier and email.
   * @returns The user object without the password field.
   * @throws NotFoundException if the user is not found.
   */
  async validate(payload: { sub: string; email: string }) {
    const user = await this.userModel
      .findOne({ email: payload.email, _id: payload.sub })
      .exec();
    delete user.password;
    return user;
  }
}
