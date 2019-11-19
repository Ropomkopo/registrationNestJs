import { Schema } from 'mongoose';
import { ACCESS_TOKEN_CONSTS } from '../tokens/tokens.consts';

export const AccessTokenSchema: Schema = new Schema({
  _id: String,
  validToDate: {
    type: Date,
    required: true,
    // tslint:disable-next-line: new-parens
    default: new Date((new Date).getTime() + ACCESS_TOKEN_CONSTS.TTL),
  },
  created: {
    type: Date,
    required: true,
    default: new Date(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    ref: 'RefreshToken',
  },
});
