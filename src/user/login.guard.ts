import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from 'src/common/login-decorator';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const isPublic = this.reflector.getAllAndOverride(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
  
    const request : Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    if (!token) {
      return false;
    }
    if (type !== 'Bearer') {
      return false;
    }
    // Kiểm tra token và xác thực người dùng ở đây (ví dụ: giải mã token, kiểm tra tính hợp lệ, v.v.)
    const decoded = this.jwtService.verify(token);
    if (!decoded) {
      return false;
    }
    request['user'] = decoded;
    console.log('login guard ...')
    console.log('user', decoded)
    return true;
  }
}
