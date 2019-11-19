import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshTokenInterface } from '../../interfaces/refresh-token.interface';
import { REFRESH_TOKEN_CONSTS } from '../tokens.consts';
import { UserInterface } from '../../interfaces/user.interface';
import { AccessTokenService } from '../access-token/access-token.service';
import randtoken = require('rand-token');

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel('RefreshToken') private readonly RefreshTokenModel: Model<RefreshTokenInterface>,
    @Inject(forwardRef(() => AccessTokenService)) private readonly accessTokenService: AccessTokenService,
  ) {
  }

  public async create(userId: UserInterface['_id']): Promise<RefreshTokenInterface> {
    Logger.log(`Function:createRefreshToken, userId:${userId}`);
    return await this.RefreshTokenModel.create({
      _id: randtoken.uid(REFRESH_TOKEN_CONSTS.SIZE),
      user: userId
    });
  }

  public async findOne(query: {}): Promise<RefreshTokenInterface> {
    return this.RefreshTokenModel.findOne(query);
  }

  public async find(query: {}): Promise<RefreshTokenInterface[]> {
    return this.RefreshTokenModel.find(query);
  }

  public async updateMany(query: {}, dataToUpdate: {}): Promise<any> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in deleteManyByQuery`);
    }
    return await this.RefreshTokenModel.updateMany(query, dataToUpdate);
  }

  public async deleteOne(query: {}): Promise<{ ok?: number, n?: number }> {
    const refreshToken: RefreshTokenInterface = await this.findOne(query);
    const data: {
      ok?: number;
      n?: number;
    } = await this.RefreshTokenModel.deleteOne({ _id: refreshToken._id });
    await this.accessTokenService.updateMany({ refreshToken: refreshToken._id }, { validToDate: 0 });
    return data;
  }

  public async deleteMany(query: {}): Promise<{ ok?: number, n?: number }> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in deleteMany`);
    }
    const refreshTokens: RefreshTokenInterface[] = await this.find(query);
    // tslint:disable-next-line: typedef
    const arratIdsOfRefreshTokens: object[] = refreshTokens.map(token => token._id);
    const data: {
      ok?: number;
      n?: number;
    } = await this.RefreshTokenModel.deleteMany({ _id: { $in: arratIdsOfRefreshTokens } });
    await this.accessTokenService.updateMany({ refreshToken: { $in: arratIdsOfRefreshTokens } }, { validToDate: 0 });
    return data;
  }
}
