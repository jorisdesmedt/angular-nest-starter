import { Injectable } from '@nestjs/common';
import { User } from './user/user';

const users: User[] = [
  new User(1, 'admin', 'admin', 'admin', 'admin@admin.com'),
  new User(2, 'user', 'user', 'user', 'user@user.com'),
];

@Injectable()
export class UserService {
  findOneById(id: number): User {
    return users.find(user => user.id === id);
  }

  findByUsernameAndPassword(username, password): User {
    return users.find(
      user => user.username === username && user.password === password,
    );
  }
}
