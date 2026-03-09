import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    unique: true,
  })
  name: string;

  @Column()
  nameCode: string;
}