import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'stock',
})
export class StockTestTypeorm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column()
  price: number;
}
