import { Controller, Inject } from '@nestjs/common';
import { ConsentManagerService } from './consent-manager.service';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import Event from '../types/event';

@Controller()
export class ConsentManagerController {
  constructor(
    @Inject('LOGGER') private client: ClientProxy,
    private readonly consentManagerService: ConsentManagerService,
  ) {}

  @EventPattern('consent_change')
  async changeConsent(
    @Payload() data: Event,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    const channe = context.getChannelRef();
    const ogmessage = context.getMessage();
    return this.consentManagerService
      .queueEvent(data)
      .then((res) => {
        channe.ack(ogmessage);
        this.client.emit('on_consent_changed', {
          requestedBy: 'system',
          updatedAt: Date.now(),
          data,
        });
        return res;
      })
      .catch(() => {
        channe.nack(ogmessage);
        return false;
      });
  }
}
