import { Injectable } from '@nestjs/common';
import { UserInterface } from './user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as md5 from 'md5';
import config from '../../../config';
import { filterSearch, formatTime, stringToDate } from '../../../util/util';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<UserInterface>,
  ) {}
  async findAll(payload) {
    let {
      pageNo = '1',
      pageSize = '10',
      orderName = 'updatedAt',
      orderDir = 'desc',
      createdAt = new Date('1970-01-01'),
    } = payload;
    createdAt = stringToDate(createdAt);
    let res = [];
    let total = 0;
    let skip = (Number(pageNo) - 1) * Number(pageSize);
    const params = filterSearch(payload, ['createAt']);
    let createdAtBuffer = {
      $gte: createdAt,
    };
    params.createdAt = createdAtBuffer;
    // 添加价格过滤
    if (!orderName) {
      orderName = 'updatedAt';
    }
    const sortObj = {
      [orderName]: orderDir === 'ascending' ? 1 : -1,
    };
    res = await this.UserModel.find(params)
      .skip(skip)
      .limit(Number(pageSize))
      .sort(sortObj)
      .exec();
    // total = await this.UserModel.count(params).exec();
    total = await this.UserModel.countDocuments();
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
  async getUserById(id: string): Promise<UserInterface> {
    return await this.UserModel.findOne({ _id: id });
  }
  async findOneByUserName(username: string): Promise<UserInterface> {
    const res = await this.UserModel.findOne({ username });
    return res;
  }
  async createOne(body: UserInterface) {
    if (!body.password) {
      body.password = '000000';
    }
    body.password = md5(body.password + config.HasSalt);
    return await this.UserModel.create(body);
  }
  async deleteById(id: string) {
    return await this.UserModel.deleteOne({ _id: id });
  }
  async deleteMany(ids: string) {
    const payload = ids.split(',') || [];
    return await this.UserModel.deleteMany({ _id: { $in: payload } });
  }
  async update(id: string, payload: UserInterface): Promise<UserInterface> {
    return await this.UserModel.findByIdAndUpdate(id, payload);
  }
  async resetPwd(id: string) {
    const user = await this.getUserById(id);
    const sPassword = '000000';
    user.password = md5(sPassword + config.HasSalt);
    return await this.UserModel.findByIdAndUpdate(id, user);
  }
  async changePwd(payload) {
    const { id, npassword } = payload;
    const user = await this.getUserById(id);
    user.password = md5(npassword + config.HasSalt);
    return await this.UserModel.findByIdAndUpdate(id, user);
  }
}
