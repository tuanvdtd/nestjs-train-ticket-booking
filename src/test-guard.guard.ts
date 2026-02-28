import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable()
// guard để kiểm tra quyền truy cập vào route, nếu trả về true thì cho phép truy cập, nếu trả về false thì không cho phép truy cập
// ở ví dụ này tôi sẽ cho nó trả về false để test xem có bị chặn truy cập vào route hay không, bạn có thể thay đổi nó thành true để cho phép truy cập vào route
// nếu muốn dùng các hàm của bên service thì cần khai báo guard ở providers của module
// và inject service đó vào guard, sau đó có thể sử dụng các hàm của service đó trong hàm canActivate() của guard
export class TestGuardGuard implements CanActivate {
  @Inject(AppService)
  private readonly appService: AppService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(`2TestGuardGuard is running --> ${this.appService.getHello()}`);
    return false;
  }
}
