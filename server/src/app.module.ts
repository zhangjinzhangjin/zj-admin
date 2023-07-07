import { Module } from "@nestjs/common";
import { RoleModule } from "./modules/sys/role/role.module";
import { UserModule } from "./modules/sys/user/user.module";
import { AuthModule } from "./modules/sys/auth/auth module";
import { MenuModule } from "./modules/sys/menu/menu.module"
import { ImgModule } from "./modules/img/img.module"
import { PetModule } from "./modules/pet/pet.module"
import { FileModule } from "./modules/file/file.module"
import { MongooseModule } from "@nestjs/mongoose";
// import { AppController } from "./app.controller";
// import { AppService } from "./app.service";
import config from "./config"
@Module({
  imports: [
    AuthModule,
    RoleModule,
    UserModule,
    MenuModule,
    ImgModule,
    PetModule,
    FileModule,
    MongooseModule.forRoot(config.mongoUrl, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, poolSize: 5}),
  ], // 这里可以直接导入module
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
