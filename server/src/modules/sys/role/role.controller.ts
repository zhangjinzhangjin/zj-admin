import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Response,
  Request,
} from '@nestjs/common';
import BaseController from '../../../helper/base.controller';
import { RoleInterface, RoleDto } from './role.interface';
import { Param, Body, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { MenuService } from './../menu/menu.service';
import { getTreeData } from '../../../util/util';
// @UseGuards(AuthGuard('bearer'))
@UseGuards(AuthGuard()) // PassportModule指定了defaultStrategy为jwt
@ApiTags('role')
@Controller('role')
export class RoleController extends BaseController {
  constructor(
    private readonly appService: RoleService,
    private readonly menuService: MenuService,
  ) {
    super();
  }
  @Get('/all') // 获取全部
  async findAll(@Response() response, @Query() payload) {
    const res = await this.appService.findAll(payload);
    return this.success(response, res);
  }
  @Post('/create') // 创建
  async create(@Body() body, @Response() response) {
    const { code } = body;
    const role: RoleInterface | null = await this.appService.findOneByCode(
      code,
    );
    if (role) {
      return this.error(response, '角色Code已存在，请不要重复添加');
    }
    if (!body.routes) {
      body.routes = [];
    }
    // if (body.routes.length === 0) {
    //   const baseRoute = await this.menuService.findOneByCode("dashboard");
    //   body.routes.push(baseRoute);
    // }
    const res = await this.appService.create(body);
    if (res._id) {
      return this.message(response, '添加角色成功');
    }
  }
  @Get('/findByCode/:code')
  @ApiParam({
    name: 'code',
    description: '这是角色编码',
  })
  async findByCode(@Param('code') code: string, @Response() response) {
    const role = await this.appService.findOneByCode(code);
    if (!role) {
      return this.error(response, '没有查询到此角色');
    }
    // 所有菜单的id
    const ids = role.routes;
    let taskList = [];
    ids.forEach((item) => {
      taskList.push(this.menuService.getMenuById(item.toString()));
    });
    const res = await Promise.all(taskList);
    const nodes = getTreeData(res);
    return this.success(response, nodes);
  }
  @Get('/view/:id')
  @ApiParam({
    name: 'id',
    description: '这是角色id',
  })
  async findById(@Param('id') id: string): Promise<RoleInterface> {
    return await this.appService.findById(id);
  }
  @Put('/update/:id')
  @ApiParam({
    name: 'id',
    description: '这是角色id',
  })
  @ApiBody({
    type: RoleDto,
    description: '角色明细',
  })
  async update(@Param('id') id: string, @Body() body, @Response() response) {
    const role: RoleInterface | null = await this.appService.findById(id);
    if (!role) {
      return this.error(response, '没有查询到此角色');
    }
    const target: RoleInterface | null = await this.appService.findOneByCode(
      body.code,
    );
    if (target && target._id.toString() !== role._id.toString()) {
      return this.error(response, '用户名不能重复');
    }
    const res = await this.appService.update(id, body);
    if (res._id) {
      return this.message(response, '角色更新成功');
    }
    return this.error(response, '更新失败');
  }
  @Delete('/delete/:id')
  @ApiParam({
    name: 'id',
    description: '角色ID',
  })
  async deleteById(@Param('id') id: string, @Response() response) {
    const res = await this.appService.deleteById(id);
    if (res.deletedCount === 1) {
      return this.message(response, '删除成功');
    } else {
      return this.error(response, '没有匹配的角色');
    }
  }
  @Get('/getRoutes') // 获取当前用户的菜单权限
  async getRoutes(@Request() request, @Response() response) {
    const user = request.user;
    const roleCode = user.role;
    const role = await this.appService.findOneByCode(roleCode);
    if (!role) {
      return this.error(response, '当前用户未分配角色');
    }
    return this.success(response, role.routes);
  }
  @Get('/getAllRoutes') // 获取所有菜单权限
  async getAllRoutes(@Response() response) {
    const routes = await this.menuService.findAll();
    if (!routes || routes.length === 0) {
      return this.error(response, '当前用户未分配角色');
    }
    return this.success(response, routes);
  }
}
