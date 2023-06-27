import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { UserModule } from './modules/sys/user/user.module';
import { RoleModule } from './modules/sys/role/role.module';
import { AuthModule } from './modules/sys/auth/auth module'
import { PetModule } from './modules/pet/pet.module'
const path = require("path");
async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useStaticAssets("public");
  app.useStaticAssets(path.join(__dirname, "..", "public"), {
    prefix: "/static/", //设置虚拟路径
  });
  // 配置swagger
  const authApiOptions = new DocumentBuilder()
    .setTitle("Auth API Doc")
    .setDescription("Auth API Info")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth") // match tags in controllers
    .build();
  const AuthApiDocument = SwaggerModule.createDocument(app, authApiOptions, {
    include: [AuthModule],
  });
  SwaggerModule.setup("swagger/auth", app, AuthApiDocument);
  const userApiOptions = new DocumentBuilder()
    .setTitle("User API Doc")
    .setDescription("User API Info")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("/user") // match tags in controllers
    .build();
  const userApiDocument = SwaggerModule.createDocument(app, userApiOptions, {
    include: [UserModule],
  });
  SwaggerModule.setup("swagger/user", app, userApiDocument);
  const roleApiOptions = new DocumentBuilder()
    .setTitle("Role API Doc")
    .setDescription("Role API Info")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("role") // match tags in controllers
    .build();
  const roleApiDocument = SwaggerModule.createDocument(app, roleApiOptions, {
    include: [RoleModule],
  });
  SwaggerModule.setup("swagger/role", app, roleApiDocument);
  const petApiOptions = new DocumentBuilder()
    .setTitle("Pet API Doc")
    .setDescription("Pet API Info")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("pet") // match tags in controllers
    .build();
  const petApiDocument = SwaggerModule.createDocument(app, petApiOptions, {
    include: [PetModule],
  });
  SwaggerModule.setup("swagger/pet", app, petApiDocument);
  app.enableCors();
  await app.listen(3000);
  console.log("service on port 3000");
}
bootstrap();
