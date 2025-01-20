import { Controller, Get } from '@nestjs/common';
import { LogManagerService } from './log-manager.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventRegister } from './types';

@Controller()
export class LogManagerController {
  constructor(private readonly logManagerService: LogManagerService) {}

  @EventPattern('on_consent_changed')
  async logEvent(
    @Payload()
    input: EventRegister,
  ) {
    return this.logManagerService.registerConsentChange(input);
  }
}
