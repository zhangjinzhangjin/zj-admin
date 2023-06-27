import * as mongoose from "mongoose";
const obj = {
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  sex: {
    type: String,
    default: -1,
  },
  desp: {
    type: String,
  },
};
const params = {
  versionKey: false,
  timestamps: true,
};
export const PetModel = new mongoose.Schema(obj, params);
