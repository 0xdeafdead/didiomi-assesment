import { Module } from '@nestjs/common';
import { ConsentManagerController } from './consent-manager.controller';
import { ConsentManagerService } from './consent-manager.service';
import { PrismaModule } from '@app/prisma';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: 'LOGGER',
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'activity_logger',
            queueOptions: {
              durable: true,
            },
          },
        },
      ],
    }),
  ],
  controllers: [ConsentManagerController],
  providers: [ConsentManagerService],
})
export class ConsentManagerModule {}
