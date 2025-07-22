import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';

export class Size {
  @Column()
  width: number;

  @Column()
  height: number;
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column()
  name: string;

  @Column()
  count: number;

  @Column((type) => Size)
  size: Size;

  @Column()
  weight: string;

  @OneToMany(() => Comment, (comment) => comment.product, { cascade: true })
  comments: Comment[];
}
