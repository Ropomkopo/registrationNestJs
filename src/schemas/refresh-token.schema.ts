import { Schema } from 'mongoose';

export const RefreshTokenSchema: Schema = new Schema({
  _id: String,
  created: {
    type: Date,
    required: true,
    default: new Date(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});
