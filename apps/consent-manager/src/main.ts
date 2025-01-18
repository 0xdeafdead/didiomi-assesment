import { NestFactory } from '@nestjs/core';
import { ConsentManagerModule } from './consent-manager.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ConsentManagerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'consent_changes',
        noAck: false,
        prefetchCount: 1,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
