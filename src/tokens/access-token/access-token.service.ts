import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ACCESS_TOKEN_CONSTS } from '../tokens.consts';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { AccessTokenInterface } from '../../interfaces/access-token.interface';
import { RefreshTokenInterface } from '../../interfaces/refresh-token.interface';
import randtoken = require('rand-token');

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectModel('AccessToken') private readonly AccessTokenModel: Model<AccessTokenInterface>,
    private readonly refreshTokenService: RefreshTokenService,
  ) {
  }

  public async create(refreshTokenId: AccessTokenInterface['refreshToken'],
                      isVerified: boolean): Promise<AccessTokenInterface> {
    const refreshToken: RefreshTokenInterface = await this.refreshTokenService.findOne({ _id: refreshTokenId });

    if (!refreshToken) {
      Logger.error(`Function:createAccessToken, Didn’t find RefreshToken`);
      throw new Error(`Token with _id ${refreshTokenId.toString()} doesn’t exist`);
    }
    Logger.log(`Function:createAccessToken, userId:${refreshToken.user}`);
    return await this.AccessTokenModel.create({
      _id: randtoken.uid(ACCESS_TOKEN_CONSTS.SIZE),
      refreshToken: refreshToken._id,
      user: refreshToken.user,
      isVerified: isVerified,
      created: new Date(),
      validToDate: new Date((new Date()).getTime() + ACCESS_TOKEN_CONSTS.TTL),
    });
  }

  public async findOne(query: {}): Promise<AccessTokenInterface> {
    const currentDate: Date = new Date();
    return this.AccessTokenModel.findOne({
      validToDate: { $gte: currentDate },
      ...query,
    });
  }

  public async find(query: {}): Promise<AccessTokenInterface[]> {
    const currentDate: Date = new Date();
    return this.AccessTokenModel.find({
      validToDate: { $gte: currentDate },
      ...query,
    });
  }

  public async updateMany(query: {}, dataToUpdate: {}): Promise<any> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in deleteManyByQuery`);
    }
    return await this.AccessTokenModel.updateMany(query, dataToUpdate);
  }

  public async deleteOne(query: {}): Promise<{ ok?: number, n?: number }> {
    return this.AccessTokenModel.deleteOne(query);
  }

  public async deleteMany(query: {}): Promise<{ ok?: number, n?: number }> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in deleteMany`);
    }
    return this.AccessTokenModel.deleteMany(query);
  }
}
