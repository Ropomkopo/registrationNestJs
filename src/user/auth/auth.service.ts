import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserInterface } from '../../interfaces/user.interface';
import { RefreshTokenInterface } from '../../interfaces/refresh-token.interface';
import { AccessTokenInterface } from '../../interfaces/access-token.interface';
import { AccessTokenService } from '../../tokens/access-token/access-token.service';
import { RefreshTokenService } from '../../tokens/refresh-token/refresh-token.service';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { EmailService } from '../../email/email.service';
const shortid = require('shortid');

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<UserInterface>,
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly userService: UserService,
        private readonly emailService: EmailService
    ) { }
    async createUser(data: CreateUserDto) {
        const user = await this.userService.findOne({ email: data.email })
        if (!user) {
            const user = await this.UserModel.create({
                _id: Types.ObjectId(),
                email: data.email,
                password: await bcrypt.hash(data.password, 9)
            });
            return await this.UserModel.findById(user._id)
        }
    }

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
    async forgotPasseord(email: UserInterface['email']) {
        const user = await this.userService.findOne({ email: email });
        const newPass = shortid.generate()
        user.password = await bcrypt.hash(newPass, 9)
        user.save();
        this.emailService.sendEmail(email, 'rolo.lisenko@gmail.com', 'newPassword to register in RomanShop', `now it is your new password  ${newPass}`)
    }
}
