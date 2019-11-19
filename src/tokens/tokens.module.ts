import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token/access-token.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenSchema } from '../schemas/refresh-token.schema';
import { AccessTokenSchema } from '../schemas/access-token.schema';
import { MongooseModule } from '@nestjs/mongoose';

const SCHEMAS: { name: string, schema: object }[] = [
  { name: 'RefreshToken', schema: RefreshTokenSchema },
  { name: 'AccessToken', schema: AccessTokenSchema },
];
@Module({
  imports: [
    MongooseModule.forFeature(SCHEMAS),
  ],
  providers: [AccessTokenService, RefreshTokenService],
  exports: [AccessTokenService, RefreshTokenService],
})
export class TokensModule {
}
