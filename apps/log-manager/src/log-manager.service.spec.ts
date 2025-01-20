import { Test, TestingModule } from '@nestjs/testing';
import { LogManagerService } from './log-manager.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConsentChange } from '../schemas/user_consent.schema';
import { EventRegister } from './types';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { create } from 'domain';

describe('LogManagerService', () => {
  let service: LogManagerService;
  const mockModel: jest.Mock = jest.fn();

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogManagerService,
        {
          provide: getModelToken(ConsentChange.name),
          useValue: mockModel as unknown as Model<ConsentChange>,
        },
      ],
    }).compile();

    service = module.get<LogManagerService>(LogManagerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerConsentChange', () => {
    const data = {
      consents: JSON.stringify(consentChangeEvent.data.consents),
      eventTime: consentChangeEvent.updatedAt,
      requestedBy: consentChangeEvent.requestedBy,
    };
    it('should save new register', (done) => {
      const save = jest.fn().mockReturnValueOnce(data);
      mockModel.mockImplementationOnce(() => ({
        save,
        toObject: jest.fn().mockReturnValue(data),
      }));

      service.registerConsentChange(consentChangeEvent).then((res) => {
        expect(save).toHaveBeenCalledTimes(1);
        expect(res).toEqual(data);
        done();
      });
    });

    it('should save send RCPException on fail', (done) => {
      const save = jest.fn().mockImplementationOnce(() => {
        throw new Error('Failed to store');
      });
      mockModel.mockImplementationOnce(() => ({
        save,
        toObject: jest.fn().mockReturnValue(data),
      }));

      service.registerConsentChange(consentChangeEvent).catch((err) => {
        expect(save).toHaveBeenCalledTimes(1);
        expect(err).toBeInstanceOf(RpcException);
        done();
      });
    });
  });
});
