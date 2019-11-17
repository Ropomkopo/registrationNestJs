import { Controller, Post, Body, Res, HttpStatus, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiUseTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { throwError } from 'rxjs';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }
    @Post()
    async signUp(@Res() res: any, @Body() data: CreateUserDto): Promise<void> {
        if (this.userService.findOne(data)) {
            return res.status(HttpStatus.BAD_REQUEST).json('your email is use')
        } else {
            const user = await this.authService.createUser(data);
            return res.status(HttpStatus.CREATED).json({ user })
        }
    }
}
