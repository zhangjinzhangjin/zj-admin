import { Injectable } from '@nestjs/common';
import { MenuInterface } from './menu.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { getTreeData } from '../../../util/util';
@Injectable()
export class MenuService {
  constructor(
    @InjectModel('Menu') private readonly MenuModel: Model<MenuInterface>,
  ) {}
  async create(payload) {
    return await this.MenuModel.create(payload);
  }
  async findList(): Promise<MenuInterface[]> {
    // 获取一维数组
    const menus = await this.MenuModel.find({}).sort({ sort: 1 }); // 按最新更新时间排序
    return menus;
  }
  async findAll(): Promise<MenuInterface[]> {
    // 获取菜单树
    const menus = await this.MenuModel.find({}).sort({ sort: 1 }); // 按最新更新时间排序
    const nodes = getTreeData(menus);
    return nodes;
  }
  async getMenuById(id: string): Promise<MenuInterface> {
    return await this.MenuModel.findOne({ _id: id });
  }
  async findOneByMenuKey(menuKey: string): Promise<MenuInterface> {
    return await this.MenuModel.findOne({ menuKey });
  }
  async update(id: string, payload: MenuInterface): Promise<MenuInterface> {
    return await this.MenuModel.findByIdAndUpdate(id, payload);
  }
  async deleteById(id: string) {
    const res = await this.MenuModel.deleteOne({ _id: id });
    const children = await this.findChildrenById(id);
    const ids = children.map((item) => item._id);
    return await this.MenuModel.deleteMany({ _id: { $in: ids } });
  }
  async findChildrenById(id: string) {
    return await this.MenuModel.find({ pid: id }).sort({ sort: 1 });
  }
}
