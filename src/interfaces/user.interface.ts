import { Document, Types } from 'mongoose';
export interface UserInterface extends Document {
    readonly _id: Types.ObjectId;
   email: string,
   password: string,
   
}