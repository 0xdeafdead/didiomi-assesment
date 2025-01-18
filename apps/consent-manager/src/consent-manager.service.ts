import { Injectable } from '@nestjs/common';
import Event from '../types/event';

@Injectable()
export class ConsentManagerService {
  queueEvent(data: Event) {
    console.log('Processing consent change');
    console.log('data', data);
    return true;
  }
}
