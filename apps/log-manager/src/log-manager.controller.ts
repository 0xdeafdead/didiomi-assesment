import { Controller, Get } from '@nestjs/common';
import { LogManagerService } from './log-manager.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class LogManagerController {
  constructor(private readonly logManagerService: LogManagerService) {}

  @EventPattern('on_consent_changed')
  logg(
    @Payload()
    input: {
      requestedBy: string;
      updatedAt: Date;
      data: Object;
    },
  ): void {
    console.log(input);
  }
}
