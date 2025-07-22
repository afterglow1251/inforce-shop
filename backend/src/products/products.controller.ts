import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductCreateDto } from './dto/product-create.dto';
import { CommentCreateDto } from './dto/comment-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('sortBy') sortBy?: 'name' | 'count') {
    return this.productsService.findAll(sortBy);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() dto: ProductCreateDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ProductUpdateDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Post(':id/comments')
  addComment(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: CommentCreateDto,
  ) {
    return this.productsService.addComment(productId, dto);
  }

  @Delete(':productId/comments/:commentId')
  removeComment(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.productsService.removeComment(productId, commentId);
  }
}
