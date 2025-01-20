import { Body, Controller, Param, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import CreateEventDTO from './dto/create-event.dto';
import { Observable } from 'rxjs';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Post()
  changeConsent(@Body() input: CreateEventDTO): Observable<boolean> {
    return this.eventsService.generateConsentChange(input);
  }
}
