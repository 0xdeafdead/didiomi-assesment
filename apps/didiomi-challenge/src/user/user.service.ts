import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  users: { id: string; email: string }[] = [];
  create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const id = randomUUID();
    const newuser = { id, email };
    this.users.push(newuser);
    return newuser;
  }

  findAll() {
    return this.users;
  }

  findOne(email: string) {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }
    return user;
  }

  remove(email: string) {
    let index: number;
    const user = this.users.find((user, i) => {
      if (user.email === email) {
        index = i;
        return user;
      }
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} does not exists`);
    }
    this.users.splice(index, 1);
    return true;
  }
}
