import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { RoleModule } from "../role/role.module"
import { UserController } from "./user.controller";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModel } from "./user.model";
@Module({
  imports: [
    // PassportModule.register({defaultStrategy: 'bearer'})
    // 指定strategy, 不用再AuthGuard里特别指定
    PassportModule.register({ defaultStrategy: "jwt" }),
    // TypeOrmModule.forFeature([User, Platform, Role]),
    MongooseModule.forFeature([
      { name: "User", schema: UserModel, collection: "User" },
    ]),
    RoleModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
