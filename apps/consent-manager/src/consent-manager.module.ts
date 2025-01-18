import { Module } from '@nestjs/common';
import { ConsentManagerController } from './consent-manager.controller';
import { ConsentManagerService } from './consent-manager.service';

@Module({
  imports: [],
  controllers: [ConsentManagerController],
  providers: [ConsentManagerService],
})
export class ConsentManagerModule {}
