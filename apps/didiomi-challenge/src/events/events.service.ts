import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import CreateEventDTO from './dto/create-event.dto';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable()
export class EventsService {
  constructor(
    @Inject('CONSENT_MANAGER') private client: ClientProxy,
    private readonly userService: UserService,
  ) {}

  generateConsentChange(input: CreateEventDTO): Observable<boolean> {
    const { user } = input;
    //validate user existence
    return this.userService.findOne(user.id).pipe(
      tap(() => this.client.emit('consent_change', input)),
      map(() => true),
      catchError((err) => {
        return throwError(() =>
          err instanceof HttpException
            ? err
            : new InternalServerErrorException(err.message),
        );
      }),
    );
  }
}
