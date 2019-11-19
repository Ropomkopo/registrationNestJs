import { Controller, Post, Body, Res, HttpStatus, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiUseTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { UserInterface } from '../../interfaces/user.interface';
import { RefreshTokenInterface } from '../../interfaces/refresh-token.interface';
import { AccessTokenInterface } from '../../interfaces/access-token.interface';
import { JwtService } from '@nestjs/jwt';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService

  ) { }
  @Post('signUp')
  async signUp(@Res() res: any, @Body() data: CreateUserDto): Promise<UserInterface> {
    const user = await this.authService.createUser(data);
    const dataOfToken: {
      refreshToken: RefreshTokenInterface;
      accessToken: AccessTokenInterface;
    } = await this.authService.generateRefreshToken(user._id, true);

    return res.status(HttpStatus.CREATED).json({
      accessToken: dataOfToken.accessToken._id,
      refreshToken: dataOfToken.refreshToken._id,
    });
  }
  @Post('signIn')
  async logIn(@Res() res: any, @Body() data: CreateUserDto){
    try {
      const payload = { email: data.email, pass: data.password };
      return res.status(HttpStatus.OK).json({
        access_token: this.jwtService.sign(payload),
      });
    } catch (error) {
      Logger.log('some value is wrong')
    }
  }


}
