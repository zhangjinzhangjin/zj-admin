import * as mongoose from 'mongoose';
export const MenuModel = new mongoose.Schema(
  {
    menuKey: { type: String, required: true, unique: true },
    menuType: { type: String, required: true },
    label: { type: String, required: true },
    desp: { type: String },
    path: { type: String, required: true },
    name: { type: String },
    aliveName: { type: String, default: '' },
    pid: { type: String },
    pname: { type: String, default: '' },
    component: { type: String },
    dynamicPage: { type: String },
    linkAddress: { type: String },
    icon: { type: String },
    sort: { type: Number },
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now() + 8 * 60 * 60 * 1000,
    },
  },
);
