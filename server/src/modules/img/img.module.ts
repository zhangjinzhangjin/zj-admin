import { Module } from "@nestjs/common";
import { ImgService } from "./img.service";
import { ImgController } from "./img.controller";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { ImgModel } from "./img.model";
@Module({
  imports: [
    // PassportModule.register({defaultStrategy: 'bearer'})
    // 指定strategy, 不用再AuthGuard里特别指定
    PassportModule.register({ defaultStrategy: "jwt" }),
    // TypeOrmModule.forFeature([User, Platform, Role]),
    MongooseModule.forFeature([
      { name: "Img", schema: ImgModel, collection: "Img" },
    ]),
  ],
  controllers: [ImgController],
  providers: [ImgService],
  exports: [ImgService],
})
export class ImgModule {}
