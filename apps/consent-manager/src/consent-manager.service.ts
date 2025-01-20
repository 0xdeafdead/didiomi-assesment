import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Event from '../types/event';
import { PrismaService } from '@app/prisma';

@Injectable()
export class ConsentManagerService {
  logger = new Logger('ConsentManagerService');
  constructor(private readonly prismaService: PrismaService) {}

  //To simulate a really heavy processing function
  async wait(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
  async queueEvent(data: Event): Promise<boolean> {
    // await this.wait(10000);
    const { user, consents } = data;
    try {
      await this.prismaService.$transaction(
        consents.map((consent) =>
          this.prismaService.userConsents.upsert({
            create: {
              userId: user.id,
              consent: consent.id,
              enabled: consent.enabled,
            },
            update: {
              enabled: consent.enabled,
            },
            where: { userId_consent: { userId: user.id, consent: consent.id } },
          }),
        ),
      );
      return true;
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }
}
