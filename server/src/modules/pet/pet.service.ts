import { Injectable } from "@nestjs/common";
import { PetInterface } from "./pet.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { filterSearch, formatTime } from "../../util/util";
@Injectable()
export class PetService {
  constructor(
    @InjectModel("Pet") private readonly PetModel: Model<PetInterface>
  ) {}
  async findAll(payload) {
    let { pageNo = "1", pageSize = "10", orderName = "updatedAt" , orderDir = "desc" } = payload;
    let res = [];
    let total = 0;
    let skip = (Number(pageNo) - 1) * Number(pageSize);
    const params = filterSearch(payload);
    if(!orderName){
      orderName = "updatedAt"
    }
    const sortObj = {
      [orderName]: orderDir === "desc"? -1: 1
    }
    res = await this.PetModel.find(params)
      .skip(skip)
      .limit(Number(pageSize))
      .sort(sortObj)
      .exec();
    total = await this.PetModel.countDocuments()
    let data = res.map((e) => {
      const jsonObject = Object.assign({}, e._doc);
      jsonObject.createdAt = formatTime(e.createdAt);
      return jsonObject;
    });
    return {
      total: total,
      list: data,
      pageSize: Number(pageSize),
      pageNo: Number(pageNo),
    };
  }
  async getById(id: string): Promise<PetInterface> {
    return await this.PetModel.findOne({ _id: id });
  }
  async getByName(name: string): Promise<PetInterface> {
    const res = await this.PetModel.findOne({ name });
    return res;
  }
  async createOne(body: PetInterface) {
    return await this.PetModel.create(body);
  }
  async deleteById(id: string) {
    return await this.PetModel.deleteOne({ _id: id });
  }
  async deleteMany(ids: string) {
    const payload:string[] = ids.split(",") || [];
    return await this.PetModel.deleteMany({_id: {$in: payload}})
  }
  async update(id: string, payload: PetInterface): Promise<PetInterface>{
    return await this.PetModel.findByIdAndUpdate(id, payload);
  }
}
