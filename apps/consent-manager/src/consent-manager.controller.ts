import { Controller } from '@nestjs/common';
import { ConsentManagerService } from './consent-manager.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import Event from '../types/event';

@Controller()
export class ConsentManagerController {
  constructor(private readonly consentManagerService: ConsentManagerService) {}

  @EventPattern('consent_change')
  changeConsent(@Payload() data: Event, @Ctx() context: RmqContext) {
    const channe = context.getChannelRef();
    const ogmessage = context.getMessage();
    this.consentManagerService
      .queueEvent(data)
      .then(() => {
        channe.ack(ogmessage);
      })
      .catch(() => {
        channe.nack(ogmessage);
      });
  }
}
