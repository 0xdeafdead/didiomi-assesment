import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@app/prisma';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { of, throwError } from 'rxjs';

const fakeUUUID = 'abcd1234-abcd-1234-defg-56789-56789defg';
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(() => fakeUUUID),
}));

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create', () => {
    const input: CreateUserDto = {
      email: 'test@testing.com',
    };
    it('should return the created User', (done) => {
      prismaMock.user.create.mockResolvedValueOnce({
        id: fakeUUUID,
        email: input.email,
      });
      service.create(input).subscribe({
        next: (user) => {
          expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
          expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: { id: fakeUUUID, email: input.email },
          });
          expect(user.email).toBe(input.email);
          expect(user.id).toBe(fakeUUUID);
          done();
        },
      });
    });

    it('should return UnprocessableEntityException', (done) => {
      prismaMock.user.create.mockResolvedValueOnce(undefined);
      service.create(input).subscribe({
        error: (err) => {
          expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
          expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: { id: fakeUUUID, email: input.email },
          });
          expect(err).toBeInstanceOf(UnprocessableEntityException);
          done();
        },
      });
    });

    it('should return InternalServerErrorException', (done) => {
      prismaMock.user.create.mockRejectedValueOnce(
        new Error('Unexpected error'),
      );
      service.create(input).subscribe({
        error: (err) => {
          expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
          expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: { id: fakeUUUID, email: input.email },
          });
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of Users', (done) => {
      prismaMock.user.findMany.mockResolvedValueOnce([
        {
          id: fakeUUUID,
          email: 'test@testing.com',
        },
      ]);
      service.findAll().subscribe({
        next: (res) => {
          expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
          expect(Array.isArray(res)).toBeTruthy();
          done();
        },
      });
    });

    it('should return InternalServerErrorException', (done) => {
      prismaMock.user.findMany.mockRejectedValueOnce(
        new Error('Unexpected error'),
      );
      service.findAll().subscribe({
        error: (err) => {
          expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });

  describe('findOne', () => {
    const id = 'abcd1234-abcd-1234-defg-56789-56789defg';
    it('should return a User', (done) => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id,
        email: 'test@testing.com',
      });
      service.findOne(id).subscribe({
        next: (res) => {
          expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
          expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { id },
            include: { consents: { select: { consent: true, enabled: true } } },
          });
          expect(res.id).toBe(id);
          expect(res.email).toBe('test@testing.com');
          done();
        },
      });
    });

    it('should return NotFoundException', (done) => {
      prismaMock.user.findUnique.mockResolvedValueOnce(undefined);
      service.findOne(id).subscribe({
        error: (err) => {
          expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
          expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { id },
            include: {
              consents: { select: { consent: true, enabled: true } },
            },
          });
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });

  describe('remove', () => {
    const id = 'abcd1234-abcd-1234-defg-56789-56789defg';
    it('should return the removed User', (done) => {
      const findOneSpy = jest.spyOn(service, 'findOne').mockReturnValueOnce(
        of({
          id,
          email: 'test@testing.com',
        }),
      );
      prismaMock.user.delete.mockResolvedValueOnce({
        id,
        email: 'test@testing.com',
      });
      service.remove(id).subscribe({
        next: (res) => {
          expect(findOneSpy).toHaveBeenCalledTimes(1);
          expect(findOneSpy).toHaveBeenCalledWith(id);
          expect(prismaMock.user.delete).toHaveBeenCalledTimes(1);
          expect(prismaMock.user.delete).toHaveBeenCalledWith({
            where: { id },
          });
          expect(res.id).toBe(id);
          done();
        },
      });
    });

    it('should return NotFoundException', (done) => {
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockReturnValueOnce(
          throwError(() => new NotFoundException('User not found')),
        );
      service.remove(id).subscribe({
        error: (err) => {
          expect(findOneSpy).toHaveBeenCalledTimes(1);
          expect(findOneSpy).toHaveBeenCalledWith(id);
          expect(prismaMock.user.delete).toHaveBeenCalledTimes(0);
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });
});
