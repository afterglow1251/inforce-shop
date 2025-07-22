import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => Product, product => product.comments, { onDelete: 'CASCADE' })
  product: Product;
}
