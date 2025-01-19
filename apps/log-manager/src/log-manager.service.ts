import { Injectable } from '@nestjs/common';

@Injectable()
export class LogManagerService {
  getHello(): string {
    return 'Hello World!';
  }
}
