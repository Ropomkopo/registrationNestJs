import { Document, Types } from 'mongoose';
import { UserInterface } from './user.interface';
export interface RefreshTokenInterface extends Document {
  readonly _id: Types.ObjectId;
  readonly created: Date;
  readonly user: UserInterface['_id']
}
