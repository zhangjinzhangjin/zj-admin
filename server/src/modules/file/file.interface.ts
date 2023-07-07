import { ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
export interface FileInterface extends Document{
    url: string,
    name: string,
}
export class FileDto {
  @ApiPropertyOptional({
    description: '地址',
  })
  readonly url?: string;
  @ApiPropertyOptional({
    description: '文件名',
  })
  readonly name?: string;
}