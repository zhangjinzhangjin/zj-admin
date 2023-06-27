import * as mongoose from "mongoose";
export const ImgModel = new mongoose.Schema(
  {
    imgname: { type: String, unique: true, required: true },
    file: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
