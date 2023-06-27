import { ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
export interface PetInterface extends Document{
    code: string,
    name: string,
    sex: string,
    desp: string,
}
export class PetDto {
  @ApiPropertyOptional({
    description: '编号',
  })
  readonly code?: string;
  @ApiPropertyOptional({
    description: '名称',
  })
  readonly name?: string;
  @ApiPropertyOptional({
    description: '性别',
  })
  readonly sex?: string;
  @ApiPropertyOptional({
    description: '备注',
  })
  readonly desp?: string;
}