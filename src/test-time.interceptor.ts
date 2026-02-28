import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TestTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    console.log('3.TestTimeInterceptor is running');
    return next.handle().pipe(
      // tap(() => {
      //   console.log(`Time exec: ${Date.now() - startTime}`);
      // }),
      // hàm map này sẽ được thực thi sau khi controller trả về data, và data này sẽ được truyền vào hàm map để xử lý trước khi trả về cho client.
      // Trong hàm map chúng ta có thể xử lí dữ liệu trả về thành 1 form thống nhất chung
      map((data) => ({
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        element: data,
        timeExec: `${Date.now() - startTime} ms`,
      })),
    );
  }
}
