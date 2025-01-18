import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import CreateEventDTO from './dto/create-event.dto';
import { ClientProxy } from '@nestjs/microservices';
import { of, switchMap } from 'rxjs';

@Injectable()
export class EventsService {
  constructor(
    @Inject('CONSENT_MANAGER') private client: ClientProxy,
    private readonly userService: UserService,
  ) {}

  generateConsentChange(input: CreateEventDTO) {
    const { user, consents } = input;
    //validate user existence
    const existinUser = this.userService.findOne(user.id);
    return this.client.emit('consent_change', input).pipe(
      switchMap((res) => {
        return of(existinUser);
      }),
    );
  }
}
