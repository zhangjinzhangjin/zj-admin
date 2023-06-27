import BaseController from '../../helper/base.controller';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  Response,
} from '@nestjs/common';
import { ImgService } from './img.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { ImgInterface, ImgDto } from './img.interface';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
const targetDir = path.resolve('./public/imgs');
const res = fs.existsSync(targetDir);
if (!res) {
  // 没有目录就创建一个
  fs.mkdirSync(targetDir);
}
@UseGuards(AuthGuard())
@ApiTags('/img')
@Controller('img')
export class ImgController extends BaseController {
  constructor(private readonly appService: ImgService) {
    super();
  }
  @Get('/all') // 获取全部
  async findAll(@Response() response, @Query() payload) {
    const res = await this.appService.findAll(payload);
    return this.success(response, res);
  }
  @Post('/create') // 创建
  async create(@Body() body, @Response() response) {
    const target = await this.appService.findOneByImgName(body.imgname);
    if (target) {
      return this.error(response, '图片名称重复');
    }
    const res = await this.appService.createOne(body);
    if (res._id) {
      return this.message(response, '添加图片成功');
    }
  }
  @Get('/id/:id')
  @ApiParam({
    name: 'id',
    description: '这是图片id',
  })
  async findById(@Param('id') id: string): Promise<ImgInterface> {
    return await this.appService.getImgById(id);
  }
  @Get('/find')
  @ApiQuery({
    name: 'imgname',
    description: '图片名称',
  })
  async findByImgName(
    @Query('imgname') imgname: string,
    @Response() response,
  ): Promise<ImgInterface | void> {
    const res = await this.appService.findOneByImgName(imgname);
    if (res) {
      return this.success(response, res);
    } else {
      return this.error(response, '没有这个图片');
    }
  }
  @Delete('/delete/:id')
  @ApiParam({
    name: 'id',
    description: '图片ID',
  })
  async deleteById(@Param('id') id: string, @Response() response) {
    const res = await this.appService.deleteById(id);
    if (res.deletedCount === 1) {
      return this.message(response, '删除成功');
    } else {
      return this.error(response, '没有匹配的图片ID');
    }
  }
  @Put('/update/:id')
  @ApiParam({
    name: 'id',
    description: '这是图片id',
  })
  @ApiBody({
    type: ImgDto,
    description: '图片明细',
  })
  async update(@Param('id') id: string, @Body() body, @Response() response) {
    const user: ImgInterface | null = await this.appService.getImgById(id);
    if (!user) {
      return this.error(response, '没有查询到此图片');
    }
    const res = await this.appService.update(id, body);
    if (res._id) {
      return this.message(response, '图片信息更新成功');
    }
    return this.error(response, '更新失败');
  }
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Response() response) {
    const filename = file.originalname;
    const extname = path.extname(filename).toLowerCase();
    const realFilename = filename.replace(extname, '');
    const timeStr = Date.now();
    const target = path.join(targetDir, `${realFilename}_${timeStr}${extname}`);
    const res = await this.appService.upload(target, file.buffer);
    if (res) {
      this.success(response, {
        url: `${realFilename}_${timeStr}${extname}`,
        serverBaseUrl: '/static/imgs',
        uid: timeStr,
      });
    } else {
      this.error(response, '图片上传失败');
    }
  }
}
