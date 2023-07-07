import BaseController from '../../helper/base.controller';
import {
  Controller,
  Get,
  Post,
  Query,
  Response,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
const targetDir = path.resolve('public/files');
const res = fs.existsSync(targetDir);
if (!res) {
  // 没有目录就创建一个
  fs.mkdirSync(targetDir);
}
@UseGuards(AuthGuard())
@ApiTags('/file')
@Controller('file')
export class FileController extends BaseController {
  constructor(private readonly appService: FileService) {
    super();
  }
  @Get('/getOneById') // 获取一个
  async findOne(@Response() response, @Query() payload) {
    const res = await this.appService.findOne(payload);
    return this.success(response, res);
  }
  @Get('/all') // 获取全部
  async findAll(@Response() response, @Query() payload) {
    const res = await this.appService.findAll(payload);
    return this.success(response, res);
  }
  @Get('/downloadById') // 下载一个
  async download(@Response() response, @Query() payload) {
    const res = await this.appService.findOne(payload);
    const targetPath = targetDir + res.url.replace('/static/files', '')
    // const readStream = fs.createReadStream(targetPath);
    // response.writeHead(200, {
    //   'Content-Type': 'application/force-download',
    //   'Content-Disposition': 'attachment; filename=' + res.name,
    // });
    // readStream.pipe(response);
    response.download(targetPath)
  }
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Response() response) {
    const filename = file.originalname;
    const extname = path.extname(filename).toLowerCase();
    const realFilename = filename.replace(extname, '');
    const timeStr = Date.now();
    const target = path.join(targetDir, `${realFilename}_${timeStr}${extname}`);
    const serverUrl = `/static/files/${realFilename}_${timeStr}${extname}`;
    const res = (await this.appService.upload(
      target,
      file.buffer,
      serverUrl,
      filename,
    )) as any;
    if (res) {
      this.success(response, {
        serverUrl,
        uid: res._id,
        name: res.name,
      });
    } else {
      this.error(response, '文件上传失败');
    }
  }
}
