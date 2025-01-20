import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { of } from 'rxjs';
import { User } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const userServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const users: User[] = [
    {
      email: 'test@testing.com',
      id: 'abcd1234-abcd-1234-defg-56789-56789defg',
    },
    {
      email: 'test2@testing.com,',
      id: 'abcd1235-abcd-1234-defg-56789-56789defg',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    const input: CreateUserDto = {
      email: 'email',
    };

    it('should call create and return a user', (done) => {
      userServiceMock.create.mockReturnValueOnce(of(users[0]));
      controller.create(input).subscribe({
        next: (res) => {
          expect(userService.create).toHaveBeenCalledWith(input);
          expect(res).toMatchObject(users[0]);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    it('should call findAll and return an array of users', (done) => {
      userServiceMock.findAll.mockReturnValueOnce(of(users));
      controller.findAll().subscribe({
        next: (res) => {
          expect(userService.findAll).toHaveBeenCalledTimes(1);
          expect(res).toMatchObject(users);
          done();
        },
      });
    });
  });

  describe('findOne', () => {
    const id = 'abcd1234-abcd-1234-defg-56789-56789defg';
    it('should call findOne and return a user', (done) => {
      userServiceMock.findOne.mockReturnValueOnce(of(users[0]));
      controller.findOne(id).subscribe({
        next: (res) => {
          expect(userService.findOne).toHaveBeenCalledWith(id);
          expect(res).toMatchObject(users[0]);
          done();
        },
      });
    });
  });

  describe('remove', () => {
    const id = 'abcd1234-abcd-1234-defg-56789-56789defg';
    it('should call remove and return a user', (done) => {
      userServiceMock.remove.mockReturnValueOnce(of(users[0]));
      controller.remove(id).subscribe({
        next: (res) => {
          expect(userService.remove).toHaveBeenCalledWith(id);
          expect(res).toMatchObject(users[0]);
          done();
        },
      });
    });
  });
});
