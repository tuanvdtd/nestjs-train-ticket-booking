import { PartialType } from '@nestjs/mapped-types';
import { CreateStockTestTypeormDto } from './create-stock-test-typeorm.dto';

export class UpdateStockTestTypeormDto extends PartialType(CreateStockTestTypeormDto) {}
