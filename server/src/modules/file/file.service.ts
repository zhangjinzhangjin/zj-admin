import { Injectable } from "@nestjs/common";
import { FileInterface } from "./file.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { filterSearch, formatTime } from "../../util/util";
import * as fs from "fs"
@Injectable()
export class FileService {
  constructor(
    @InjectModel("File") private readonly FileModel: Model<FileInterface>
  ) {}
  async findOne(payload) {
    const { id } = payload;
    return await this.FileModel.findOne({ _id: id });
  }
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
    res = await this.FileModel.find(params)
      .skip(skip)
      .limit(Number(pageSize))
      .sort(sortObj)
      .exec();
    total = await this.FileModel.countDocuments()
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
  async upload(path, fileBuffer, url, filename){
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(path);
      writeStream.write(fileBuffer)
      writeStream.on('error', (err) => {
        resolve(false)
      });
      writeStream.on('finish', async () => {
        const payload = {
          name: filename,
          url,
        }
        const res =  await this.FileModel.create(payload);
        resolve(res)
      });
      writeStream.end();
    })
  }
}
