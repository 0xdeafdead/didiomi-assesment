import { Module } from '@nestjs/common';
import { LogManagerController } from './log-manager.controller';
import { LogManagerService } from './log-manager.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsentChange, ConsentSchema } from '../schemas/user_consent.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:superSecret@localhost:27017', {
      dbName: 'logs',
    }),
    MongooseModule.forFeature([
      { name: ConsentChange.name, schema: ConsentSchema },
    ]),
  ],
  controllers: [LogManagerController],
  providers: [LogManagerService],
})
export class LogManagerModule {}
