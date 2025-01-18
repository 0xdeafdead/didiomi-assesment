import { Controller, Post } from '@nestjs/common';
import { ConsentManagerService } from './consent-manager.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import Event from '../types/event';
import { Observable, of, switchMap } from 'rxjs';

@Controller()
export class ConsentManagerController {
  constructor(private readonly consentManagerService: ConsentManagerService) {}

  @EventPattern('consent_change')
  changeConsent(
    @Payload() data: Event,
    @Ctx() context: RmqContext,
  ): Observable<boolean> {
    const channe = context.getChannelRef();
    const ogmessage = context.getMessage();
    return this.consentManagerService.queueEvent(data, context).pipe(
      switchMap((res) => {
        if (res) {
          channe.ack(ogmessage);
        }
        return of(true);
      }),
    );
  }
}
