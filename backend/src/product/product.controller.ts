import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Query() queryParams: QueryProductDto) {
    return this.productService.getAllProducts(queryParams);
  }

  @Get('/:productId')
  findOneProduct(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.productService.getProduct(productId);
  }

  @Delete('/:productId')
  removeProduct(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.productService.deleteProduct(productId);
  }

  @Post()
  createProduct(@Body() productData: CreateProductDto) {
    return this.productService.createProduct(productData);
  }

  @Patch('/:productId')
  updateProduct(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() productData: UpdateProductDto,
  ) {
    return this.productService.updateProduct(productId, productData);
  }
}
