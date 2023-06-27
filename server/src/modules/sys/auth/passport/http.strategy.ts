import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
@Injectable()
// 要继承@nest/passport下的PassportStrategy并传入passport
// 本列是以http bearer为例
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async validate(token: string) {
    const user = await this.authService.validateUser(token);
    if (!user) {
      return new UnauthorizedException();
    }
    return user;
  }
}
