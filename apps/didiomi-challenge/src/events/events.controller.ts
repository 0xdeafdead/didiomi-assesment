import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import CreateEventDTO from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Post()
  changeConsent(@Body() input: CreateEventDTO) {
    this.eventsService.generateConsentChange(input);
  }
}
