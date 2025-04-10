import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private configService: ConfigService) {
    const secret = configService.get('JWT_SECRET') || 'vfsvus';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    this.logger.debug(`Stratégie JWT initialisée avec le secret: ${secret}`);
  }

  async validate(payload: any) {
    try {
      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return user;
    } catch (error) {
      throw error;
    }
  }
}
