import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { TokensModule } from 'src/tokens/tokens.module';
import { ConfigModule } from 'src/config/config.module';
import { RefreshTokenSchema } from 'src/schemas/refresh-token.schema';
import { AccessTokenSchema } from 'src/schemas/access-token.schema';

@Module({
  providers: [UserService,
    AuthService],
  controllers: [
    AuthController,
    UserController
  ],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'RefreshToken', schema: RefreshTokenSchema },
      { name: 'AccessToken', schema: AccessTokenSchema },
    ]),
    ConfigModule,
    TokensModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '69999s' },
    }),
  ],
  exports: [UserService]
})
export class UserModule { }
