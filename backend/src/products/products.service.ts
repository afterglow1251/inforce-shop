import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Comment } from './entities/comment.entity';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { CommentCreateDto } from './dto/comment-create.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  async findAll(sortBy?: 'name' | 'count'): Promise<Product[]> {
    const products = await this.productRepo.find({ relations: ['comments'] });

    if (sortBy === 'count') {
      products.sort((a, b) => a.count - b.count);
    } else if (sortBy === 'name') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      products.sort((a, b) => {
        const nameCompare = a.name.localeCompare(b.name);
        if (nameCompare !== 0) return nameCompare;
        return a.count - b.count;
      });
    }

    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['comments'],
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async create(dto: ProductCreateDto): Promise<Product> {
    if (!dto.name || !dto.count || !dto.imageUrl || !dto.weight || !dto.size) {
      throw new BadRequestException('Missing product data');
    }
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async update(id: number, dto: ProductUpdateDto): Promise<Product> {
    const product = await this.findOne(id);
    if (dto.size) {
      product.size = dto.size;
      delete dto.size;
    }
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }

  async addComment(productId: number, dto: CommentCreateDto): Promise<Comment> {
    const product = await this.findOne(productId);
    const comment = this.commentRepo.create({
      ...dto,
      product,
    });
    return this.commentRepo.save(comment);
  }

  async removeComment(productId: number, commentId: number): Promise<void> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['product'],
    });
    if (!comment || comment.product.id !== productId) {
      throw new NotFoundException('Comment not found for this product');
    }
    await this.commentRepo.remove(comment);
  }
}
