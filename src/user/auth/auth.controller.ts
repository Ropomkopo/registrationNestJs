import { Controller, Post, Body, Res, HttpStatus, Logger, HttpException, Param, Get } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserInterface } from '../../interfaces/user.interface';
import { RefreshTokenInterface } from '../../interfaces/refresh-token.interface';
import { AccessTokenInterface } from '../../interfaces/access-token.interface';
import { EmailService } from '../../email/email.service';
import { asap } from 'rxjs/internal/scheduler/asap';
import { async } from 'rxjs/internal/scheduler/async';




@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: EmailService

  ) { }
  @Post('signUp')
  async signUp(@Res() res: any, @Body() data: CreateUserDto): Promise<UserInterface> {
    try {
      const user = await this.authService.createUser(data);
      const dataOfToken: {
        refreshToken: RefreshTokenInterface;
        accessToken: AccessTokenInterface;
      } = await this.authService.generateRefreshToken(user._id, true);

      return res.status(HttpStatus.CREATED).json({
        accessToken: dataOfToken.accessToken._id,
        refreshToken: dataOfToken.refreshToken._id,
      });
    } catch (error) {
      throw new HttpException('You have this user in your DB', HttpStatus.BAD_REQUEST)
    }
  }
  @Post('LogIn')
  async logIn(@Res() res: any, @Body() data: CreateUserDto) {
    const user = await this.userService.findOne({ email: data.email });
    if (user) {
      const pass = await bcrypt.compare(data.password, user.password);
      if (pass == true) {
        const payload = { email: data.email, pass: data.password };
        const accessToken = this.jwtService.sign(payload)
        return res.status(HttpStatus.OK).json({
          access_token: accessToken,
        });
      } throw new HttpException('your pass is not valid', HttpStatus.BAD_REQUEST)
    } else {
      throw new HttpException('your email is not valid', HttpStatus.BAD_REQUEST)
    }
  }

  @Post('forgotPassword/:email')
  @ApiImplicitParam({ name: 'email', required: true })
  async forgotPassword(@Res() res: any, @Param('email') email: UserInterface['email']) {
    try {
      await this.authService.forgotPasseord(email);
      return res.status(HttpStatus.OK).json(`new password sended to ${email}`)
    } catch (error) {
      throw new HttpException('your email is not valid', HttpStatus.BAD_REQUEST)
    }
  }
}
