import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
// import { HttpStrategy } from './passport/http.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './passport/jwt.strategy';
@Module({
  imports: [
    JwtModule.register({
      // secretOrPrivateKey: "zjToken",
      secret: 'zjToken',
      signOptions: {
        // expiresIn: 3600,
      },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy], //HttpStrategy
  controllers: [AuthController],
})
export class AuthModule {}
