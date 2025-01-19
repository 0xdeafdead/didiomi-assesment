import { Module } from '@nestjs/common';
import { ConsentManagerController } from './consent-manager.controller';
import { ConsentManagerService } from './consent-manager.service';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PrismaModule],
  controllers: [ConsentManagerController],
  providers: [ConsentManagerService],
})
export class ConsentManagerModule {}
