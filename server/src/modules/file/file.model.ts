import * as mongoose from 'mongoose';
export const FileModel = new mongoose.Schema(
  {
    url: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now() + 8 * 60 * 60 * 1000,
    },
  },
);
