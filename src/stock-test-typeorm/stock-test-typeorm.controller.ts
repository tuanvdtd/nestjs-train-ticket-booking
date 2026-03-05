import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockTestTypeormService } from './stock-test-typeorm.service';
import { CreateStockTestTypeormDto } from './dto/create-stock-test-typeorm.dto';
import { UpdateStockTestTypeormDto } from './dto/update-stock-test-typeorm.dto';

@Controller('stock')
export class StockTestTypeormController {
  constructor(private readonly stockTestTypeormService: StockTestTypeormService) {}

  @Post()
  create(@Body() createStockTestTypeormDto: CreateStockTestTypeormDto) {
    return this.stockTestTypeormService.create(createStockTestTypeormDto);
  }

  @Get()
  findAll() {
    return this.stockTestTypeormService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockTestTypeormService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockTestTypeormDto: UpdateStockTestTypeormDto) {
    return this.stockTestTypeormService.update(+id, updateStockTestTypeormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockTestTypeormService.remove(+id);
  }
}
