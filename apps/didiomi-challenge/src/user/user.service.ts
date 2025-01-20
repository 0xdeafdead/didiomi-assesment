import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from '@app/prisma';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  users: { id: string; email: string }[] = [];
  create(createUserDto: CreateUserDto): Observable<User> {
    const id = randomUUID();
    return from(
      this.prismaService.user.create({
        data: { id, email: createUserDto.email },
      }),
    ).pipe(
      switchMap((newUser) => {
        if (!newUser) {
          throw new UnprocessableEntityException('Could not create user');
        }
        return of(newUser);
      }),
      catchError((err) => {
        return throwError(() =>
          err instanceof HttpException
            ? err
            : new InternalServerErrorException(err.message),
        );
      }),
    );
  }

  findAll(): Observable<User[]> {
    return from(
      this.prismaService.user.findMany({ include: { consents: true } }),
    ).pipe(
      catchError((err) => {
        return throwError(() =>
          err instanceof HttpException
            ? err
            : new InternalServerErrorException(err.message),
        );
      }),
    );
  }

  findOne(id: string): Observable<User> {
    return from(
      this.prismaService.user.findUnique({
        where: { id },
        include: {
          consents: {
            select: {
              consent: true,
              enabled: true,
            },
          },
        },
      }),
    ).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException(`No user found with id ${id}`);
        }
        return of(user);
      }),
      catchError((err) => {
        return throwError(() =>
          err instanceof HttpException
            ? err
            : new InternalServerErrorException(err.message),
        );
      }),
    );
  }

  remove(id: string): Observable<User> {
    return this.findOne(id).pipe(
      switchMap(() =>
        from(
          this.prismaService.user.delete({
            where: {
              id,
            },
          }),
        ),
      ),
      catchError((err) => {
        return throwError(() =>
          err instanceof HttpException
            ? err
            : new InternalServerErrorException(err.message),
        );
      }),
    );
  }
}
