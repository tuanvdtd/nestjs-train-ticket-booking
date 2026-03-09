import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { TestMiddlewareMiddleware } from './test-middleware.middleware';
import { TestGuardGuard } from './test-guard.guard';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { StockTestTypeormModule } from './stock-test-typeorm/stock-test-typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTestTypeorm } from './stock-test-typeorm/entities/stock-test-typeorm.entity';
import { User } from './user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permisstion.entity';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './user/login.guard';
import { RbacGuard } from './user/rbac.guard';

@Module({
  imports: [
    OrderModule, UserModule, DbModule, StockTestTypeormModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'train_ticket',
      entities: [StockTestTypeorm, User, Role, Permission],
      synchronize: true,
      logging: true,
      migrations: []
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret-jwt-key-nestjs-train-ticket-booking-123',
      signOptions: { expiresIn: '1h' },
    }),
    AdminModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'provider-value',
      useValue: {
        name: 'John Doe',
        age: 30,
      },
    },
    {
      provide: 'guard-provider',
      useClass: TestGuardGuard,
    },
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RbacGuard,
    }
  ],
  /*
  - imports: Đây là nơi bạn khai báo các module khác mà module này phụ thuộc vào. Trong trường hợp này, AppModule phụ thuộc vào OrderModule, 
  vì vậy chúng ta đã thêm OrderModule vào mảng imports.
  - controllers: Đây là nơi bạn khai báo các controller mà module này cung cấp. Trong trường hợp này, AppModule cung cấp AppController,
  vì vậy chúng ta đã thêm AppController vào mảng controllers.
  - providers: Đây là nơi bạn khai báo các provider mà module này cung cấp. Trong trường hợp này, AppModule cung cấp AppService, 
  vì vậy chúng ta đã thêm AppService vào mảng providers.
  ** Khi bạn thêm một module vào mảng imports, tất cả các controller và provider được định nghĩa trong module đó sẽ trở thành một phần của module hiện tại. 
  Điều này có nghĩa là bạn có thể sử dụng các controller và provider từ OrderModule trong AppModule mà không cần phải khai báo lại chúng.
  ** Khi bạn thêm một controller vào mảng controllers, NestJS sẽ tự động tạo một instance của controller đó và quản lý vòng đời của nó. 
  Điều này có nghĩa là bạn không cần phải tạo instance của controller đó bằng tay, NestJS sẽ lo liệu việc đó cho bạn.
  ** Khi bạn thêm một provider vào mảng providers, NestJS sẽ tự động tạo một instance của provider đó và quản lý vòng đời của nó. 
  Điều này có nghĩa là bạn không cần phải tạo instance của provider đó bằng tay, NestJS sẽ lo liệu việc đó cho bạn.
  provider còn có thể được định nghĩa là một class, một value, một factory hoặc một async factory. Khi bạn định nghĩa một provider, 
  bạn có thể sử dụng nó để inject vào các controller hoặc service khác trong module của bạn.
  ví dụ: 
  providers: [
  * Khi sử dung useClass, bạn có thể định nghĩa một class cụ thể mà provider sẽ sử dụng để tạo instance. Điều này cho phép bạn thay thế một class bằng một class khác nếu cần thiết, mà không cần phải thay đổi code của các controller hoặc service đang sử dụng provider đó.
  {
      provide: 'MY_CLASS',
      useClass: AppService
    },
    {
      provide: 'MY_VALUE', => đây là một value provider, nó sẽ trả về một giá trị khi được inject vào một controller hoặc service khác. Khi bạn sử dụng useValue, bạn có thể định nghĩa một giá trị cụ thể mà provider sẽ trả về. Giá trị này có thể là bất kỳ loại dữ liệu nào, như string, number, object, v.v.
      useValue: 'This is a value provider',
    },
    {
      provide: 'MY_FACTORY', => đây là một factory provider, nó sẽ trả về một giá trị khi được inject vào một controller hoặc service khác. Khi bạn sử dụng useFactory, bạn có thể định nghĩa một hàm để tạo ra giá trị mà provider sẽ trả về. Hàm này có thể nhận các dependency khác làm tham số nếu cần thiết.
      useFactory: (user1, user2) => {
        return {
          name: user1.name + ' ' + user2.name,
          age: user1.age + user2.age,
        };
      },
      inject: ['USER-1', 'USER-2'], => đây là một mảng các dependency mà hàm useFactory cần để tạo ra giá trị. Khi provider được inject vào một controller hoặc service khác, NestJS sẽ tự động resolve các dependency này và truyền chúng vào hàm useFactory.
    },
    {
      provide: 'MY_ASYNC_FACTORY', => đây là một async factory provider, nó sẽ trả về một giá trị khi được inject vào một controller hoặc service khác. Khi bạn sử dụng useFactory kết hợp với async, bạn có thể định nghĩa một hàm bất đồng bộ để tạo ra giá trị mà provider sẽ trả về. Hàm này có thể nhận các dependency khác làm tham số nếu cần thiết và có thể sử dụng await để chờ các tác vụ bất đồng bộ hoàn thành trước khi trả về giá trị.
      useFactory: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // giả sử có một tác vụ bất đồng bộ mất 1 giây để hoàn thành
        return {
          name: 'John Doe',
          age: 30,
        };
      },
    },
  ],
  * nếu dùng các provider  tự định nghĩa tên thì trong các controller hoặc service khác khi muốn inject provider đó thì phải sử dụng tên đã định nghĩa trong provide để inject, ví dụ:
  @Inject('MY_CLASS')
  private readonly myClass: AppService;
  */
})
export class AppModule implements NestModule {
  // cần implement NestModule để sử dụng middleware trong module này
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TestMiddlewareMiddleware).forRoutes('/api/testmiddleware');
  }
}
