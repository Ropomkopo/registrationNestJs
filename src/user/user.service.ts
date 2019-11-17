import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserInterface } from 'src/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<UserInterface>,
    ) { }
    async findOneByQuery(query: string): Promise<UserInterface> {
        return await this.UserModel.findOne(query)
    }
    async findOne(value: object): Promise<UserInterface> {
        return await this.UserModel.findOne(value)
    }
}
