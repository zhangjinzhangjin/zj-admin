import BaseController from '../../../helper/base.controller';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Response,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { UserInterface, UserDto } from './user.interface';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../role/role.service';
@UseGuards(AuthGuard())
@ApiTags('/user')
@Controller('user')
export class UserController extends BaseController {
  constructor(
    private readonly appService: UserService,
    private readonly roleService: RoleService,
  ) {
    super();
  }
  @Get('/all') // 获取全部
  async findAll(@Response() response, @Query() payload) {
    // this.user
    const res = await this.appService.findAll(payload);
    return this.success(response, res);
  }
  @Post('/create') // 创建
  async create(@Body() body, @Response() response) {
    const { username } = body;
    const user: UserInterface | null = await this.appService.findOneByUserName(
      username,
    );
    if (user) {
      return this.error(response, ' 用户名已存在，请不要重复添加');
    }
    const res = await this.appService.createOne(body);
    if (res._id) {
      return this.message(response, '添加用户成功');
    }
  }
  @Get('/id/:id')
  @ApiParam({
    name: 'id',
    description: '这是角色id',
  })
  async findById(@Param('id') id: string): Promise<UserInterface> {
    return await this.appService.getUserById(id);
  }
  @Get('/find')
  @ApiQuery({
    name: 'name',
    description: '用户名',
  })
  async findByUserName(
    @Query('name') name: string,
    @Response() response,
  ): Promise<UserInterface | void> {
    const res = await this.appService.findOneByUserName(name);
    if (res) {
      return this.success(response, res);
    } else {
      return this.error(response, '没有这个用户');
    }
  }
  @Delete('/delete/:id')
  @ApiParam({
    name: 'id',
    description: '用户ID',
  })
  async deleteById(@Param('id') id: string, @Response() response) {
    const res = await this.appService.deleteById(id);
    if (res.deletedCount === 1) {
      return this.message(response, '删除成功');
    } else {
      return this.error(response, '没有匹配的用户ID');
    }
  }
  @Delete('/deleteMany')
  async deleteMany(@Body('ids') ids: string, @Response() response) {
    const res = await this.appService.deleteMany(ids);
    if (res.deletedCount > 0) {
      return this.message(response, '删除成功');
    } else {
      return this.error(response, '没有匹配的用户ID');
    }
  }
  @Get('/current')
  async getCurrent(@Request() request, @Response() response) {
    // 从jwt中获取当前登录用户
    const user = request.user;
    user.password = 'are you OK?';
    if (user) {
      return this.success(response, user);
    } else {
      return this.error(response, '当前没有用户登录');
    }
  }
  @Put('/update/:id')
  @ApiParam({
    name: 'id',
    description: '这是角色id',
  })
  @ApiBody({
    type: UserDto,
    description: '角色明细',
  })
  async update(@Param('id') id: string, @Body() body, @Response() response) {
    const user: UserInterface | null = await this.appService.getUserById(id);
    if (!user) {
      return this.error(response, '没有查询到此用户');
    }
    const target: UserInterface | null = await this.appService.findOneByUserName(
      body.username,
    );
    if (target && target._id.toString() !== user._id.toString()) {
      return this.error(response, '用户名不能重复');
    }
    const res = await this.appService.update(id, body);
    if (res._id) {
      return this.message(response, '用户信息更新成功');
    }
    return this.error(response, '更新失败');
  }
  @Get('/getRoutes/:id') // 获取指定用户权限菜单
  @ApiParam({
    name: 'id',
    description: '这是角色id',
  })
  async getRoutes(@Param('id') id: string, @Response() response) {
    const user = await this.appService.getUserById(id);
    const code = user.role;
    const role = await this.roleService.findOneByCode(code);
    return this.success(response, role.routes);
  }
  @Get('/resetPwd/:id') // 重置密码
  @ApiParam({
    name: 'id',
    description: '这是角色id',
  })
  async resetPwd(@Param('id') id: string, @Response() response) {
    const res = await this.appService.resetPwd(id);
    return this.message(response, '密码重置为000000');
  }
  @Post('/changePwd') // 重置密码
  async changePwd(@Body() payload, @Response() response) {
    const res = await this.appService.changePwd(payload);
    return this.message(response, '密码w修改成功');
  }
}
