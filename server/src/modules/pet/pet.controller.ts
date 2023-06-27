import BaseController from "../../helper/base.controller";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Response } from "@nestjs/common";
import { PetService } from "./pet.service";
import { AuthGuard } from "@nestjs/passport";
import { UseGuards } from "@nestjs/common";
import { PetInterface, PetDto } from "./pet.interface";
import { ApiBody, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

// @UseGuards(AuthGuard())
@ApiTags("/pet")
@Controller("pet")
export class PetController extends BaseController {
  constructor(private readonly appService: PetService) {
    super();
  }
  @Get("/all") // 获取全部
  @ApiParam({
    name: "sex",
    description: "-1 0 1",
    allowEmptyValue: true
  })
  @ApiParam({
    name: "code",
    description: "编号",
    allowEmptyValue: true
  })
  @ApiParam({
    name: "name",
    description: "宠物名",
    allowEmptyValue: true
  })
  @ApiParam({
    name: "pageNo",
    description: "第几页",
    example: 1
  })
  @ApiParam({
    name: "pageSize",
    description: "一页几条",
    example: 10
  })
  async findAll(@Response() response, @Query() payload) {
    const res = await this.appService.findAll(payload);
    return this.success(response, res);
  }
  @Post("/create") // 创建
  @ApiBody({
    type: PetDto,
    description: "明细",
  })
  async create(@Body() body, @Response() response) {
    const { name, code, sex } = body;
    if(!code || !name || !sex){
      return this.error(response, "参数没传全，需要name code sex");
    }
    const target: PetInterface | null = await this.appService.getByName(name);
    if (target) {
      return this.error(response, " name已存在，请不要重复添加");
    }
    const res = await this.appService.createOne(body);
    if (res._id) {
      return this.message(response, "添加成功");
    }
  }
  @Get("/id/:id")
  @ApiParam({
    name: "id",
    description: "id",
  })
  async findById(@Param("id") id: string): Promise<PetInterface> {
    return await this.appService.getById(id);
  }
  @Get("/find")
  @ApiQuery({
    name: "name",
    description: "name",
  })
  async getByName(@Query("name") name: string, @Response() response): Promise<PetInterface | void>{
    const res = await this.appService.getByName(name)
    if(res){
      return this.success(response, res);
    }else{
      return this.error(response, "not found")
    }
  }
  @Delete("/delete/:id")
  @ApiParam({
    name: "id",
    description: "ID",
  })
  async deleteById(@Param("id") id: string, @Response() response) {
    const res = await this.appService.deleteById(id);
    if(res.deletedCount === 1){
      return this.message(response, "删除成功")
    }else{
      return this.error(response, "没有匹配的ID")
    }
  }
  @Delete("/deleteMany/:ids")
  @ApiParam({
    name: "ids",
    description: "IDS，以,分隔",
  })
  async deleteMany(@Param("ids") ids: string, @Response() response) {
    const res = await this.appService.deleteMany(ids);
    if(res.deletedCount > 0){
      return this.message(response, "删除成功")
    }else{
      return this.error(response, "没有匹配的ID")
    }
  }
  @Put("/update/:id")
  @ApiParam({
    name: "id",
    description: "id",
  })
  @ApiBody({
    type: PetDto,
    description: "明细",
  })
  async update(@Param("id") id: string, @Body() body, @Response() response) {
    const target: PetInterface | null = await this.appService.getById(id);
    if (!target) {
      return this.error(response, "not found");
    }
    const uniquetarget: PetInterface | null = await this.appService.getByName(body.code);
    if (uniquetarget && uniquetarget._id.toString() !== target._id.toString()) {
      return this.error(response, "repeated code");
    }
    const res = await this.appService.update(id, body);
    if(res._id){
      return this.message(response, "更新成功")
    }
    return this.error(response, "更新失败")
  }
}
