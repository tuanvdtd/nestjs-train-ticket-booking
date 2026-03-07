import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    unique: true,
  })
  name: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
