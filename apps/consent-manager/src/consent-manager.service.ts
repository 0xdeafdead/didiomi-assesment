import { Injectable } from '@nestjs/common';
import Event from '../types/event';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class ConsentManagerService {
  queueEvent(data: Event, ctx: RmqContext): Observable<boolean> {
    const wait = () => new Promise((resolve) => setTimeout(resolve, 10000));
    return from(wait()).pipe(
      switchMap((x) => {
        return of(true);
      }),
      catchError((err) => {
        return throwError(() => new Error('Failed to process consent change'));
      }),
    );
  }
}
