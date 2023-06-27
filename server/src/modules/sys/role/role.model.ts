import * as mongoose from 'mongoose';
export const RoleModel = new mongoose.Schema(
  {
    label: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    desc: { type: String },
    // routes: { type: Array, required: true },
    routes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
      },
    ],
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now() + 8 * 60 * 60 * 1000,
    },
  },
);
