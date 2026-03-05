import { Injectable } from '@nestjs/common';
import { CreateStockTestTypeormDto } from './dto/create-stock-test-typeorm.dto';
import { UpdateStockTestTypeormDto } from './dto/update-stock-test-typeorm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StockTestTypeorm } from './entities/stock-test-typeorm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockTestTypeormService {

  @InjectRepository(StockTestTypeorm)
  private stockTestTypeormRepository: Repository<StockTestTypeorm>;

  create(createStockTestTypeormDto: CreateStockTestTypeormDto) {
    return this.stockTestTypeormRepository.save(createStockTestTypeormDto);
  }

  findAll() {
    return this.stockTestTypeormRepository.find();
  }

  findOne(id: number) {
    return this.stockTestTypeormRepository.findOneBy({ id });
  }

  update(id: number, updateStockTestTypeormDto: UpdateStockTestTypeormDto) {
    return this.stockTestTypeormRepository.update(id, updateStockTestTypeormDto);
  }

  remove(id: number) {
    return this.stockTestTypeormRepository.delete(id);
  }
}
