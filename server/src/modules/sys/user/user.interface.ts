import { ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
export interface UserInterface extends Document{
  username: string,
  password: string,
  mobile: string,
  name: string,
  sex: string,
  role: string
}
export class UserDto {
  @ApiPropertyOptional({
    description: '姓名',
  })
  readonly name?: string;
  @ApiPropertyOptional({
    description: '用户名',
  })
  readonly username: string;
  @ApiPropertyOptional({
    description: '密码',
  })
  readonly password: string;
}