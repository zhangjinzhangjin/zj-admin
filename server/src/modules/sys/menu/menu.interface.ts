import { ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
export interface MenuInterface extends Document {
  label: string;
  code: string;
  pid: string;
  path: string;
  desc?: string;
  sort?: number;
}
export class MenuDto {
  @ApiPropertyOptional({
    description: '菜单名',
  })
  readonly label?: string;
  @ApiPropertyOptional({
    description: '菜单编码',
  })
  readonly code: string;
  @ApiPropertyOptional({
    description: '父菜单编码',
  })
  readonly parent: string;
  @ApiPropertyOptional({
    description: '菜单路由',
  })
  readonly path: string;
  @ApiPropertyOptional({
    description: '描述',
  })
  readonly desc: string;
}
