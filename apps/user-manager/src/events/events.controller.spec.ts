import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import CreateEventDTO from './dto/create-event.dto';
import { of, throwError } from 'rxjs';
import { InternalServerErrorException } from '@nestjs/common';

describe('EventsController', () => {
  let controller: EventsController;
  let eventsService: EventsService;

  const eventServiceMock = {
    generateConsentChange: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: eventServiceMock }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(eventsService).toBeDefined();
  });

  describe('changeConsent', () => {
    const input: CreateEventDTO = {
      user: {
        id: 'cba321',
      },
      consents: [
        { enabled: false, id: 'EMAIL_NOTIFICATIONS' },
        { enabled: true, id: 'SMS_NOTIFICATIONS' },
      ],
    };
    it('should return true', (done) => {
      eventServiceMock.generateConsentChange.mockReturnValueOnce(of(true));
      controller.changeConsent(input).subscribe({
        next: (res) => {
          expect(eventServiceMock.generateConsentChange).toHaveBeenCalledTimes(
            1,
          );
          expect(eventServiceMock.generateConsentChange).toHaveBeenCalledWith(
            input,
          );
          done();
        },
      });
    });

    it('should return error', (done) => {
      eventServiceMock.generateConsentChange.mockReturnValueOnce(
        throwError(
          () =>
            new InternalServerErrorException(
              'Failed to execute consent change',
            ),
        ),
      );
      controller.changeConsent(input).subscribe({
        error: (err) => {
          expect(eventServiceMock.generateConsentChange).toHaveBeenCalledTimes(
            1,
          );
          expect(eventServiceMock.generateConsentChange).toHaveBeenCalledWith(
            input,
          );
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });
});
