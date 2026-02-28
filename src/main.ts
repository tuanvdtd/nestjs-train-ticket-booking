import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// import { NextFunction } from 'express';
// import { TestGuardGuard } from './test-guard.guard';
// import { TestTimeInterceptor } from './test-time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  /*
  ** có thể làm middleware tổng quát tại đây
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('middleware tổng quát');
    next();
    console.log('chạy cuối nè');
  });

  ** có thể làm guard tổng quát tại đây
  app.useGlobalGuards(new TestGuardGuard());
  ** có thể làm interceptor tổng quát tại đây
  app.useGlobalInterceptors(new TestTimeInterceptor());
  ** có thể làm pipe tổng quát tại đây
  app.useGlobalPipes(new TestValidatePipe());
  ** có thể làm filter tổng quát tại đây
  app.useGlobalFilters(new TestErrorFilter());
  */
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
