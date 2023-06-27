import { ApiPropertyOptional } from "@nestjs/swagger";
import { Document } from 'mongoose';
export interface RoleInterface extends Document{
  label: string;
  code: string;
  desc?: string;
  routes: Array<object>
}
export class RoleDto {
  @ApiPropertyOptional({
    description: '角色名称',
  })
  readonly label?: string;
  @ApiPropertyOptional({
    description: '角色编码',
  })
  readonly code: string;
  @ApiPropertyOptional({
    description: '描述',
  })
  readonly desc: string;
  @ApiPropertyOptional({
    description: '角色关联',
  })
  readonly routes: Array<object>;
}