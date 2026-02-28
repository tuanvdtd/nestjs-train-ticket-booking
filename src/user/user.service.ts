import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  private dbService: DbService;

  async register(registerUserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read();
    const existingUser = users.find(
      (user) => user.username === registerUserDto.username,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const user = new User();
    user.password = registerUserDto.password;
    user.username = registerUserDto.username;
    users.push(user);
    await this.dbService.write(users);
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read();
    const user = users.find((user) => user.username === loginUserDto.username);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.password !== loginUserDto.password) {
      throw new BadRequestException('Login failed');
    }
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
