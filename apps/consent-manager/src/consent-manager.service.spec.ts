import { PrismaService } from '@app/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import Event from '../types/event';
import { ConsentManagerService } from './consent-manager.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('ConsentManagerService', () => {
  let consentManagerService: ConsentManagerService;
  let prismaService: PrismaService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsentManagerService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    consentManagerService = module.get<ConsentManagerService>(
      ConsentManagerService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
    expect(consentManagerService).toBeDefined();
  });

  describe('queueEvent', () => {
    const data: Event = {
      consents: [{ id: 'EMAIL_NOTIFICATIONS', enabled: true }],
      user: { id: 'randomId' },
    };

    it('should return true when transactions is executed sucessfully', (done) => {
      prismaMock.$transaction.mockResolvedValueOnce([]);
      consentManagerService.queueEvent(data).then((res) => {
        expect(res).toBeTruthy();
        expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
        expect(prismaMock.$transaction).toHaveBeenCalledWith(
          data.consents.map((consent) =>
            prismaMock.userConsents.upsert({
              create: {
                userId: data.user.id,
                consent: consent.id,
                enabled: consent.enabled,
              },
              update: {
                enabled: consent.enabled,
              },
              where: {
                userId_consent: { userId: data.user.id, consent: consent.id },
              },
            }),
          ),
        );
        done();
      });
    });

    it('should return error when transaction fails', () => {
      prismaMock.$transaction.mockRejectedValueOnce(
        new Error('Could not process transaction'),
      );
      consentManagerService.queueEvent(data).catch((err) => {
        expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
        expect(prismaMock.$transaction).toHaveBeenCalledWith(
          data.consents.map((consent) =>
            prismaMock.userConsents.upsert({
              create: {
                userId: data.user.id,
                consent: consent.id,
                enabled: consent.enabled,
              },
              update: {
                enabled: consent.enabled,
              },
              where: {
                userId_consent: { userId: data.user.id, consent: consent.id },
              },
            }),
          ),
        );
        expect(err).toBeInstanceOf(InternalServerErrorException);
      });
    });
  });
});
