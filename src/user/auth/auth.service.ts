import { Injectable, Logger } from '@nestjs/common';
import { UserInterface } from 'src/interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RefreshTokenInterface } from '../../interfaces/refresh-token.interface';
import { AccessTokenInterface } from '../../interfaces/access-token.interface';
import { AccessTokenService } from '../../tokens/access-token/access-token.service';
import { RefreshTokenService } from '../../tokens/refresh-token/refresh-token.service';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<UserInterface>,
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }
    async createUser(data: CreateUserDto) {
        // if (!(this.userService.findOne(data))) {
        const user = await this.UserModel.create({
            _id: Types.ObjectId(),
            email: data.email,
            password: await bcrypt.hash(data.password, 9)
        });
        return await this.UserModel.findById(user._id)
        // }
        // else {
        //     Logger.log('You have this user in your DB')
        // }
    }

    // async login(user: any) {
    //     const payload = { username: user.username, sub: user.userId };
    //     return {
    //         access_token: this.jwtService.sign(payload),
    //     };
    // }

    
    async generateRefreshToken(userId: UserInterface['_id'], isVerified: boolean):
        Promise<{
            refreshToken: RefreshTokenInterface;
            accessToken: AccessTokenInterface;
        }> {
        const refreshToken: RefreshTokenInterface = await this.refreshTokenService.create(userId);
        const accessToken: AccessTokenInterface = await this.accessTokenService.create(refreshToken._id, isVerified);
        return {
            refreshToken,
            accessToken,
        };
    }
}
