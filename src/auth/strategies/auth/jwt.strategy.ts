import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '8f2a3e2c7b0d5c4e827fcd11d273fb021c973d9e42baff5f8309dcba2e9e7587', // Replace with your secret key
      algorithms: ['HS256']
    });
  }

  async validate(payload: any) {
    this.logger.log(payload);
    return { userId: payload.sub, email: payload.email };
  }
}