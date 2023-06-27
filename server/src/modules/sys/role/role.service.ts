import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleInterface } from './role.interface';
import { MenuService } from '../menu/menu.service';
import { filterSearch, formatTime } from '../../../util/util';
@Injectable()
export class RoleService {
  constructor(
    @InjectModel('Role') private readonly RoleModel: Model<RoleInterface>,
    private readonly menuService: MenuService,
  ) {}
  async findAll(payload) {
    let {
      pageNo = '1',
      pageSize = '10',
      orderName = 'updatedAt',
      orderDir = 'desc',
    } = payload;
    let res = [];
    let total = 0;
    let skip = (Number(pageNo) - 1) * Number(pageSize);
    const params = filterSearch(payload);
    if (!orderName) {
      orderName = 'updatedAt';
    }
    const sortObj = {
      [orderName]: orderDir === 'ascending' ? 1 : -1,
    };
    res = await this.RoleModel.find(params)
      .populate('routes')
      .skip(skip)
      .limit(Number(pageSize))
      .sort(sortObj)
      .exec();
    total = await this.RoleModel.countDocuments();
    let data = res.map((e) => {
      const jsonObject = Object.assign({}, e._doc);
      jsonObject.createdAt = formatTime(e.createdAt);
      jsonObject.updatedAt = formatTime(e.updatedAt);
      return jsonObject;
    });
    return {
      total: total,
      list: data,
      pageSize: Number(pageSize),
      pageNo: Number(pageNo),
    };
  }
  // async findAll(): Promise<RoleInterface[]> {
  //   return await this.RoleModel.find({})
  //     .sort({ updatedAt: -1 })
  //     .populate('Menu'); // 按最新更新时间排序
  // }
  async findById(id: string): Promise<RoleInterface> {
    return await this.RoleModel.findOne({ _id: id }).populate('routes');
  }
  async findOneByCode(code: string): Promise<RoleInterface> {
    if (code === 'admin') {
      // 超管
      const allMenus = await this.menuService.findList();
      const menuIds = allMenus.map((item) => item._id);
      const adminRole = await this.RoleModel.findOne({ code });
      adminRole.routes = menuIds;
      await this.update(adminRole._id, adminRole);
      return adminRole;
    }
    // return await this.RoleModel.findOne({ code }).populate('routes');
    return await this.RoleModel.findOne({ code });
  }
  async create(payload) {
    return await this.RoleModel.create(payload);
  }
  async update(id: string, payload: RoleInterface): Promise<RoleInterface> {
    return await this.RoleModel.findByIdAndUpdate(id, payload);
  }
  async deleteById(id: string) {
    return await this.RoleModel.deleteOne({ _id: id });
  }
}
