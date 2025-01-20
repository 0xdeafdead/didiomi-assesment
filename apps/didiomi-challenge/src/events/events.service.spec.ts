import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { UserService } from '../user/user.service';
import { of, throwError } from 'rxjs';
import CreateEventDTO from './dto/create-event.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let userService: UserService;

  const mockProxy = {
    emit: jest.fn(),
  };

  const userServiceMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: 'CONSENT_MANAGER',
          useValue: mockProxy,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('generateConsentChange', () => {
    const input: CreateEventDTO = {
      user: {
        id: 'cba321',
      },
      consents: [
        { enabled: false, id: 'EMAIL_NOTIFICATIONS' },
        { enabled: true, id: 'SMS_NOTIFICATIONS' },
      ],
    };
    it('should return true if user was found and message emitted', (done) => {
      userServiceMock.findOne.mockReturnValueOnce(
        of({ id: 'abc123', email: 'test@testing,com' }),
      );
      service.generateConsentChange(input).subscribe({
        next: (res) => {
          expect(userServiceMock.findOne).toHaveBeenCalledTimes(1);
          expect(userServiceMock.findOne).toHaveBeenCalledWith(input.user.id);
          expect(mockProxy.emit).toHaveBeenCalledTimes(1);
          expect(mockProxy.emit).toHaveBeenCalledWith('consent_change', input);
          expect(res).toBeTruthy();
          done();
        },
      });
    });

    it('should return NotFoundException if user is not found', (done) => {
      userServiceMock.findOne.mockReturnValueOnce(
        throwError(() => new NotFoundException('User not found')),
      );
      service.generateConsentChange(input).subscribe({
        error: (err) => {
          expect(userServiceMock.findOne).toHaveBeenCalledTimes(1);
          expect(userServiceMock.findOne).toHaveBeenCalledWith(input.user.id);
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should return InternalServerException if an unexpected error occur', (done) => {
      userServiceMock.findOne.mockReturnValueOnce(
        throwError(() => new Error('User not found')),
      );
      service.generateConsentChange(input).subscribe({
        error: (err) => {
          expect(userServiceMock.findOne).toHaveBeenCalledTimes(1);
          expect(userServiceMock.findOne).toHaveBeenCalledWith(input.user.id);
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });
});
