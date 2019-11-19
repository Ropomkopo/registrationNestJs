import { Document, Types } from 'mongoose';
import { UserInterface } from './user.interface';
import { RefreshTokenInterface } from './refresh-token.interface';

export interface AccessTokenInterface extends Document {
  readonly _id: Types.ObjectId;
  readonly validToDate: Date;
  readonly created: Date;
  readonly user: UserInterface['_id'];
  readonly isVerified: boolean;
  readonly refreshToken: RefreshTokenInterface['_id'];
}
