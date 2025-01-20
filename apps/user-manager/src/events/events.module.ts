import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
