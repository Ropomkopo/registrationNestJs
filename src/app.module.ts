import { Module } from '@nestjs/common';
import { MongooseService } from './mongoose/mongoose.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseService,
    }),
    UserModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
