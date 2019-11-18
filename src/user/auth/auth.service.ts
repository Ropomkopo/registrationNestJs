import { Injectable, Logger } from '@nestjs/common';
import { UserInterface } from 'src/interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<UserInterface>,
        private readonly jwtService: JwtService
    ) { }
    async createUser(data: CreateUserDto) {
        await this.UserModel.create({
            _id: Types.ObjectId(),
            email: data.email,
            password: await bcrypt.hash(data.password, 9)
        });
        const payload = { email: data.email, password: data.password };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signIn(data: CreateUserDto) {
        const users = await this.UserModel.find();
        users.forEach(element => {
            if (element.email === data.email && bcrypt.compare(data.password, element.password)) {
                Logger.log('You are in system')
            } else {
                Logger.log('You can\'t go insayt because your data is not valid')
            }
        });
    }
}
