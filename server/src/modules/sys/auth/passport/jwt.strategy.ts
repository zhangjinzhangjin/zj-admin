import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // 这里没有intellisense可以用，下面这一段是说
      // 要从header取得bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 这里的key就是要跟create token时的key一样
      secretOrKey: 'zjToken',
    });
  }
  // Passport会自动verify jwt，如果key不正确，或是相关信息不正确，如issuer
  async validate(payload) {
    const user = await this.authService.validateUser(payload);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
