import {
  Controller,
  Get,
  Inject,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TestGuardGuard } from './test-guard.guard';
import { TestTimeInterceptor } from './test-time.interceptor';
import { TestValidatePipe } from './test-validate.pipe';
import { TestErrorFilter } from './test-error.filter';

interface User {
  name: string;
  age: number;
}

@Controller()
// có thể dùng middleware, guard, interceptor, pipe, filter ở đây để áp dụng cho toàn bộ controller này như: @UseGuards(), @UseInterceptors(), @UsePipes(), @UseFilters() trực tiếp trên class controller.
@UseInterceptors(TestTimeInterceptor)
export class AppController {
  // dependency injection cho AppService để sử dụng phương thức getHello() trong AppService
  constructor(
    private readonly appService: AppService,
    @Inject('provider-value')
    private readonly user: User,
  ) {}
  /* 

   constructor(appService: AppService) {
    this.appService = appService;
  }
  ** Nhưng cách viết trên sẽ không được NestJS hỗ trợ vì nó không sử dụng từ khóa private hoặc public để khai báo biến appService, do đó NestJS sẽ không biết rằng appService là một dependency cần được inject vào constructor. Cách viết đúng là sử dụng từ khóa private hoặc public để khai báo biến appService, như sau:
 constructor(private readonly appService: AppService) {
    this.appService = appService;
  }
  ** Hoặc dùng @ Inject() decorator để khai báo dependency injection cho appService mà không cần dùng contructor, như sau:
  @Inject(AppService)
  private readonly appService: AppService;
  Nếu dùng cách này thì bạn không cần phải khai báo constructor và gán giá trị cho appService, NestJS sẽ tự động inject AppService vào biến appService khi khởi tạo AppController.
  */

  @Get()
  getHello(): string {
    console.log(this.user.name);
    return this.appService.getHello();
  }
  @Get('/api/cr7')
  // sử dụng guard trực tiếp ở từng route bằng cách thêm @UseGuards() decorator vào route đó, như sau:
  @UseGuards(TestGuardGuard)
  getUser(): string {
    console.log('log trong req sau khi chạy qua middleware');
    return 'hello from api/cr7';
  }
  @Get('/api/m10')
  // sử dụng guard trực tiếp ở từng route bằng cách thêm @UseGuards() decorator vào route đó, như sau:
  // interceptor cũng tương tự như guard, bạn có thể sử dụng @UseInterceptors() decorator để áp dụng interceptor cho một route cụ thể. Interceptor sẽ được thực thi sau khi guard đã cho phép truy cập vào route đó. Data từ hàm getM10 có thể được sử dụng ở hàm của Interceptor,....
  @UseInterceptors(TestTimeInterceptor)
  getM10(): string {
    console.log('dataa trả về qua controller');
    return 'hello from api/m10';
  }
  @Get('/api/m11')
  @UseInterceptors(TestTimeInterceptor)
  @UseFilters(new TestErrorFilter())
  getM11(@Query('value', TestValidatePipe) result: number) {
    console.log('number:', result);
    return result;
  }
}
