import * as mongoose from 'mongoose';
export const UserModel = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: false },
    name: { type: String, required: false },
    sex: {
      type: String,
      default: '-1',
    },
    role: { type: String, required: true, default: 'admin' },
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now() + 8 * 60 * 60 * 1000,
    },
  },
);
