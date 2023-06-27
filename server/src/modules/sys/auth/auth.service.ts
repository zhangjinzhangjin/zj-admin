import {
  Injectable,
  UnauthorizedException,
  HttpException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserInterface } from "../user/user.interface";
import * as md5 from "md5";
import config from "../../../config"
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}
  async createToken(name: string, password: string) {
    const user: UserInterface | null = await this.usersService.findOneByUserName(
      name
    );
    if (!user) {
      throw new UnauthorizedException("用户名不存在。");
    }
    if (user.password !== md5(password + config.HasSalt)) {
      throw new UnauthorizedException("密码不对。");
    }
    const expiration = 60 * 60 * 24 * 7;
    const accessToken = this.jwtService.sign(
      { id: user._id },
      {
        // jwt只加密id
        expiresIn: expiration,
      }
    );
    return {
      expiration,
      accessToken,
    };
  }
  async validateUser(payload) {
    return await this.usersService.getUserById(payload.id); // 把整个user对象拿回来，会自动放入到req中
  }
}
