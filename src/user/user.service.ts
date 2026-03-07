import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
// import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserVo } from './vo/login.vo';

@Injectable()
export class UserService {
/*
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
*/
  @InjectRepository(User)
  private userRepository: Repository<User>;
  @Inject(JwtService)
  private jwtService: JwtService;

  async register(registerUserDto: RegisterUserDto) : Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { username: registerUserDto.username } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const newUser = new User();
    newUser.password = await bcrypt.hash(registerUserDto.password, 10);
    newUser.username = registerUserDto.username;
    newUser.email = registerUserDto.email;
    return this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto) : Promise<LoginUserVo> {
    const user = await this.userRepository.findOne({ where: { username: loginUserDto.username } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Login failed');
    }
    const payload = {
      userName: user.username,
      userId: user.id,
    }
    const token = this.jwtService.sign(payload);
    const rs = new LoginUserVo();
    rs.elements = {
      user: user,
      token: token
    }
    rs.message = 'Login successful';
    rs.success = true;
    return rs;
  }

  getProfile(userId: number) {
    return 'This action returns the profile of user with id: ' + userId;
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
