import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { TokensModule } from '../tokens/tokens.module';
import { ConfigModule } from '../config/config.module';
import { RefreshTokenSchema } from '../schemas/refresh-token.schema';
import { AccessTokenSchema } from '../schemas/access-token.schema';

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
      signOptions: { expiresIn: '9m' },
    }),
  ],
  exports: [UserService]
})
export class UserModule { }
