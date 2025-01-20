import { Test, TestingModule } from '@nestjs/testing';
import { LogManagerController } from './log-manager.controller';
import { LogManagerService } from './log-manager.service';
import { EventRegister } from './types';
import { ConsentChange } from '../schemas/user_consent.schema';

describe('LogManagerController', () => {
  let logManagerController: LogManagerController;
  let logManagerService: LogManagerService;

  const mockService = {
    registerConsentChange: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LogManagerController],
      providers: [{ provide: LogManagerService, useValue: mockService }],
    }).compile();

    logManagerController = app.get<LogManagerController>(LogManagerController);
    logManagerService = app.get<LogManagerService>(LogManagerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(logManagerController).toBeDefined();
    expect(logManagerService).toBeDefined();
  });

  describe('registerConsentChange', () => {
    const consentChangeEvent: EventRegister = {
      requestedBy: 'test',
      updatedAt: new Date(),
      data: {
        user: {
          id: 'test',
        },
        consents: [
          {
            id: 'EMAIL_NOTIFICATIONS',
            enabled: true,
          },
        ],
      },
    };
    it('should return a "ConsentChange"', (done) => {
      const consentChange: ConsentChange = {
        consents: JSON.stringify(consentChangeEvent.data.consents),
        eventTime: consentChangeEvent.updatedAt,
        requestedBy: consentChangeEvent.requestedBy,
      };
      mockService.registerConsentChange.mockResolvedValueOnce(consentChange);
      logManagerController.logEvent(consentChangeEvent).then((res) => {
        expect(mockService.registerConsentChange).toHaveBeenCalledTimes(1);
        expect(mockService.registerConsentChange).toHaveBeenCalledWith(
          consentChangeEvent,
        );
        expect(res).toMatchObject(consentChange);
        done();
      });
    });
  });
});
