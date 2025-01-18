import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [UserModule],
})
export class EventsModule {}
