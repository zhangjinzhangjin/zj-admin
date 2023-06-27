import { ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
export interface ImgInterface extends Document{
  imgname: string,
  file: string,
}
export class ImgDto {
  @ApiPropertyOptional({
    description: '图片名称',
  })
  readonly imgname: string;
  @ApiPropertyOptional({
    description: '图片文件',
  })
  readonly file: string;
}