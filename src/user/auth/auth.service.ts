import { Injectable } from '@nestjs/common';
import { UserInterface } from 'src/interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<UserInterface>,
    ){}
    async createUser(data: CreateUserDto){
        await this.UserModel.create({
            _id: Types.ObjectId(),
            email: data.email,
            password: await bcrypt.hash(data.password, 9)
        })
    }
}
