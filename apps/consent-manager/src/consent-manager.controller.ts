import { Controller, Post } from '@nestjs/common';
import { ConsentManagerService } from './consent-manager.service';
import { EventPattern } from '@nestjs/microservices';
import Event from '../types/event';

@Controller()
export class ConsentManagerController {
  constructor(private readonly consentManagerService: ConsentManagerService) {}

  @EventPattern('consent_change')
  changeConsent(data: Event): boolean {
    return this.consentManagerService.queueEvent(data);
  }
}
