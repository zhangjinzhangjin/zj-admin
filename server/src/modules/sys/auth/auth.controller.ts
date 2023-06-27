import { Controller, Post, Body, Response } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { UserInterface, UserDto } from '../user/user.interface';
import { AuthService } from './auth.service';
import BaseController from '../../../helper/base.controller';
@ApiTags('auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }
  // 默认密码admin, 000000
  // 传入name及password取得jwt token
  @Post('/login')
  async getToken(
    @Body('username') username: string,
    @Body('password') password: string,
    @Response() response,
  ) {
    const res = await this.authService.createToken(username, password);
    return this.success(response, res);
  }
  @Post('/regist') // 创建用户
  @ApiBody({
    type: UserDto,
    description: '用户名',
  })
  async regist(@Body() body: UserInterface, @Response() response) {
    const { username } = body;
    const targetUser = await this.userService.findOneByUserName(username);
    if (targetUser) {
      return this.error(response, '用户名已存在');
    }
    const res = await this.userService.createOne(body);
    if (res._id) {
      return this.message(response, '添加新用户成功');
    }
  }
}
