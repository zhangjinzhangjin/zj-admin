// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}
//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
//   @Get("/aaa")
//   aaa(): string {
//     return "aaa";
//   }
// }
import { UserController } from "./modules/sys/user/user.controller";
// import { RoleController } from "./controllers/role.controller";
// export default [UserController, RoleController];
export default [UserController];
