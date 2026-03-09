import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from 'src/db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoginGuard } from './login.guard';

@Module({
  imports: [
    DbModule.register({
      path: 'users.json',
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'GUARD_PROVIDER',
      useClass: LoginGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
