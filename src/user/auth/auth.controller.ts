import { Controller, Post, Body, Res, HttpStatus, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiUseTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { throwError } from 'rxjs';
import { UserInterface } from 'src/interfaces/user.interface';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }
    @Post('signUp')
    async signUp(@Res() res: any, @Body() data: CreateUserDto): Promise<UserInterface> {
            const user = await this.authService.createUser(data);
            return res.status(HttpStatus.CREATED).json({ user })
    }
    // @Post('signIn')
    // async logIn(@Res() res: any, @Body() data: CreateUserDto): Promise<void> {
    //     try{
    //         await this.authService.login(data);
    //         return res.status(HttpStatus.OK).json();
    //     }catch(error){
    //         throwError('some value is wrong')
    //     }
    // }


}
