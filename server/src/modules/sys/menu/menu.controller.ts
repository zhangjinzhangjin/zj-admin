import BaseController from '../../../helper/base.controller';
import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Param,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { MenuInterface, MenuDto } from './menu.interface';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
@UseGuards(AuthGuard())
@ApiTags('/menu')
@Controller('menu')
export class MenuController extends BaseController {
  constructor(private readonly appService: MenuService) {
    super();
  }
  @Get('/all') // 获取全部
  async findAll(@Response() response) {
    const res = await this.appService.findAll();
    return this.success(response, res);
  }
  @Post('/create') // 创建菜单
  async create(@Body() body, @Response() response) {
    const { menuKey } = body;
    const menu: MenuInterface | null = await this.appService.findOneByMenuKey(
      menuKey,
    );
    if (menu) {
      return this.error(response, '菜单键已存在，请不要重复添加');
    }
    const { pid } = body;
    const children = await this.appService.findChildrenById(pid);
    body.sort = children.length;
    const res = await this.appService.create(body);
    if (res._id) {
      return this.message(response, '添加菜单成功');
    }
  }
  @Get('/view/:id')
  @ApiParam({
    name: 'id',
    description: '这是菜单id',
  })
  async findById(@Param('id') id: string): Promise<MenuInterface> {
    return await this.appService.getMenuById(id);
  }
  @Put('/update/:id')
  @ApiParam({
    name: 'id',
    description: '这是菜单id',
  })
  @ApiBody({
    type: MenuDto,
    description: '菜单明细',
  })
  async update(@Param('id') id: string, @Body() body, @Response() response) {
    const menu: MenuInterface | null = await this.appService.getMenuById(id);
    if (!menu) {
      return this.error(response, '没有查询到此菜单');
    }
    const target: MenuInterface | null = await this.appService.findOneByMenuKey(
      body.menuKey,
    );
    if (target && target._id.toString() !== menu._id.toString()) {
      return this.error(response, '菜单主键不能重复');
    }
    const res = await this.appService.update(id, body);
    if (res._id) {
      return this.message(response, '菜单修改成功');
    }
  }
  @Delete('/delete/:id')
  @ApiParam({
    name: 'id',
    description: '菜单ID',
  })
  async deleteById(@Param('id') id: string, @Response() response) {
    const res = await this.appService.deleteById(id);
    return this.message(response, '删除成功');
    // if (res.deletedCount > 0) {
    //   return this.message(response, '删除成功');
    // } else {
    //   return this.error(response, '没有匹配菜单');
    // }
  }
  @Put('/sort')
  async sort(@Body() payload, @Response() response) {
    const { id, targetId, direct } = payload;
    const sNode = await this.appService.getMenuById(id); // 拖的节点
    const tNode = await this.appService.getMenuById(targetId); // 放的节点
    let children = [];
    if (direct === 'inner') {
      children = await this.appService.findChildrenById(targetId);
      sNode.pid = targetId;
      sNode.sort = 0;
      children.forEach((item, index) => {
        item.sort = index + 1;
      });
    } else if (direct === 'before') {
      children = await this.appService.findChildrenById(tNode.pid);
      children = children.filter((item) => {
        return item._id.toString() != sNode._id.toString();
      });
      sNode.pid = tNode.pid;
      const tNodeSort = tNode.sort;
      sNode.sort = tNodeSort;
      let updateIndex = 10000;
      children.forEach((item, index) => {
        if (item._id.toString() == tNode._id.toString()) {
          updateIndex = index;
        }
        if (index >= updateIndex) {
          item.sort = item.sort + 1;
        }
      });
    } else if (direct === 'after') {
      children = await this.appService.findChildrenById(tNode.pid);
      children = children.filter((item) => {
        return item._id.toString() != sNode._id.toString();
      });
      sNode.pid = tNode.pid;
      const tNodeSort = tNode.sort;
      sNode.sort = tNodeSort + 1;
      let updateIndex = 10000;
      children.forEach((item, index) => {
        if (item._id.toString() == tNode._id.toString()) {
          updateIndex = index;
        }
        if (index > updateIndex) {
          item.sort = item.sort + 1;
        }
      });
    }
    let taskList = [];
    [...children, sNode].forEach((item) => {
      taskList.push(this.appService.update(item._id, item));
    });
    const res = await Promise.all(taskList);
    return this.message(response, '菜单树更新成功');
  }
}
