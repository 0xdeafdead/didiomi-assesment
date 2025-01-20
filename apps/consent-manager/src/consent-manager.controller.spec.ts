import { Test, TestingModule } from '@nestjs/testing';
import { ConsentManagerController } from './consent-manager.controller';
import { ConsentManagerService } from './consent-manager.service';
import {
  ClientProxy,
  ClientProxyFactory,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import Event from '../types/event';
import { of } from 'rxjs';

describe('ConsentManagerController', () => {
  let consentManagerController: ConsentManagerController;
  let consentManagerService: ConsentManagerService;

  const mockProxy = {
    emit: jest.fn(),
  };

  const mockService = {
    queueEvent: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsentManagerController],
      providers: [
        {
          provide: 'LOGGER',
          useValue: mockProxy,
        },
        {
          provide: ConsentManagerService,
          useValue: mockService,
        },
      ],
    }).compile();

    consentManagerController = app.get<ConsentManagerController>(
      ConsentManagerController,
    );
    consentManagerService = app.get<ConsentManagerService>(
      ConsentManagerService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(consentManagerController).toBeDefined();
    expect(consentManagerService).toBeDefined();
  });

  describe('changeConsent', () => {
    const data: Event = {
      consents: [],
      user: { id: 'randomId' },
    };
    const ackMock = jest.fn();
    const nackMock = jest.fn();
    const context = {
      getChannelRef: () => ({
        ack: ackMock,
        nack: nackMock,
      }),

      getMessage: () => ({ message: 'test' }),
    } as any as RmqContext;
    it('should call ack and emit message', () => {
      mockService.queueEvent.mockResolvedValueOnce(true);
      mockProxy.emit.mockReturnValueOnce(of(true));
      consentManagerController.changeConsent(data, context).then((res) => {
        expect(mockService.queueEvent).toHaveBeenCalledTimes(1);
        expect(ackMock).toHaveBeenCalledTimes(1);
        expect(mockProxy.emit).toHaveBeenCalledTimes(1);
        expect(res).toBeTruthy();
      });
    });

    it('should call nack and return false', () => {
      mockService.queueEvent.mockRejectedValueOnce(
        new Error('Failed to update'),
      );
      mockProxy.emit.mockReturnValueOnce(of(true));
      consentManagerController.changeConsent(data, context).then((res) => {
        expect(mockService.queueEvent).toHaveBeenCalledTimes(1);
        expect(nackMock).toHaveBeenCalledTimes(1);
        expect(mockProxy.emit).toHaveBeenCalledTimes(0);
        expect(res).toBeFalsy();
      });
    });
  });
});
