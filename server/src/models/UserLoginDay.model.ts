import mongoose, { Document, Schema } from 'mongoose';

export interface IUserLoginDay extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userLoginDaySchema = new Schema<IUserLoginDay>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userLoginDaySchema.index({ userId: 1, date: 1 }, { unique: true });

const UserLoginDay = mongoose.model<IUserLoginDay>('UserLoginDay', userLoginDaySchema);

export default UserLoginDay;
