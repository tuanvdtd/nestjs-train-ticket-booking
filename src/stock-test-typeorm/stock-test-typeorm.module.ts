import { Module } from '@nestjs/common';
import { StockTestTypeormService } from './stock-test-typeorm.service';
import { StockTestTypeormController } from './stock-test-typeorm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTestTypeorm } from './entities/stock-test-typeorm.entity';

@Module({
  // TypeOrmModule.forFeature([StockTestTypeorm]) sẽ đăng ký entity StockTestTypeorm với TypeORM,
  // cho phép chúng ta sử dụng repository của StockTestTypeorm trong StockTestTypeormService.
  imports: [TypeOrmModule.forFeature([StockTestTypeorm])],
  controllers: [StockTestTypeormController],
  providers: [StockTestTypeormService],
})
export class StockTestTypeormModule {}
