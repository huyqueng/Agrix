import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUSer } from '@modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    //decode the token
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          if (!req || !req.cookies) return null;
          return req.cookies['access_token'] || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET')!,
    });
  }

  validate(payload: IUSer) {
    //req.user
    return {
      _id: payload._id,
      userId: payload.userId,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role,
    };
  }
}
