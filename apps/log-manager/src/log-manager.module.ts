import { Module } from '@nestjs/common';
import { LogManagerController } from './log-manager.controller';
import { LogManagerService } from './log-manager.service';

@Module({
  imports: [],
  controllers: [LogManagerController],
  providers: [LogManagerService],
})
export class LogManagerModule {}
