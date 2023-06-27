import { Injectable } from "@nestjs/common";
import { ImgInterface } from "./img.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { filterSearch, formatTime } from "../../util/util";
import * as fs from "fs"
@Injectable()
export class ImgService {
  constructor(
    @InjectModel("Img") private readonly ImgModel: Model<ImgInterface>
  ) {}
  async findAll(payload) {
    const { pageNo = "1", pageSize = "10" } = payload;
    let res = [];
    let total = 0;
    let skip = (Number(pageNo) - 1) * Number(pageSize);
    const params = filterSearch(payload);
    res = await this.ImgModel.find(params)
      .skip(skip)
      .limit(Number(pageSize))
      .sort({ updatedAt: -1 })
      .exec();
    // total = await this.UserModel.count(params).exec();
    total = await this.ImgModel.countDocuments()
    return {
      total: total,
      list: res,
      pageSize: Number(pageSize),
      pageNo: Number(pageNo),
    };
  }
  async getImgById(id: string): Promise<ImgInterface> {
    return await this.ImgModel.findOne({ _id: id });
  }
  async findOneByImgName(imgname: string): Promise<ImgInterface> {
    const res = await this.ImgModel.findOne({ imgname });
    return res;
  }
  async createOne(body: ImgInterface) {
    return await this.ImgModel.create(body);
  }
  async deleteById(id: string) {
    return await this.ImgModel.deleteOne({ _id: id });
  }
  async update(id: string, payload: ImgInterface): Promise<ImgInterface>{
    return await this.ImgModel.findByIdAndUpdate(id, payload);
  }
  async upload(fileName, fileBuffer){
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(fileName);
      writeStream.write(fileBuffer)
      writeStream.on('error', (err) => {
        resolve(false)
      });
      writeStream.on('finish', () => {
        resolve(true)
      });
      writeStream.end();
    })
  }
}
