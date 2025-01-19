import { Body, Controller, Param, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import CreateEventDTO from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Post()
  changeConsent(@Body() input: CreateEventDTO) {
    return this.eventsService.generateConsentChange(input);
  }
}
