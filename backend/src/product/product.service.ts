import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import { dirname } from 'path';
import {
  ERROR_MESSAGES,
  PRODUCT_JSON_PATH,
  SUCCESS_MESSAGE,
} from 'src/constant';
import { v4 as uuidv4 } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto, SortingOrder } from './dto/query-product.dto';

@Injectable()
export class ProductService implements OnModuleInit, OnModuleDestroy {
  private readonly productSet = new Map();

  onModuleInit() {
    if (!fs.existsSync(PRODUCT_JSON_PATH)) {
      fs.mkdirSync(dirname(PRODUCT_JSON_PATH), { recursive: true });
      fs.writeFileSync(PRODUCT_JSON_PATH, JSON.stringify([]), 'utf-8');
    }

    const data = fs.readFileSync(PRODUCT_JSON_PATH, 'utf-8');

    try {
      const products: (CreateProductDto & { id: string })[] = JSON.parse(data);
      products.forEach((product) => this.productSet.set(product.id, product));
      console.log('Products Loaded Successfully from the memory');
    } catch (error) {
      console.error('Failed to load products', error);
    }
  }

  onModuleDestroy() {
    const data = JSON.stringify(Array.from(this.productSet.values()), null, 2);
    fs.writeFileSync(PRODUCT_JSON_PATH, data, 'utf-8');
    console.log('Product saved to file!');
  }

  getAllProducts(queryParams: QueryProductDto) {
    const data = Array.from(this.productSet.values());
    const filteredProducts = this.filterProducts(data, queryParams);

    return {
      data: filteredProducts,
      page: queryParams.page,
      limit: queryParams.limit,
      total: data.length,
    };
  }

  getProduct(productId: string): {
    data: CreateProductDto & { id: string };
  } {
    const product = this.productSet.get(productId);

    if (!product) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT.NOT_FOUND_ERROR);
    }

    return { data: product };
  }

  createProduct(productData: CreateProductDto) {
    const productId = uuidv4();
    this.productSet.set(productId, { ...productData, id: productId });
    return { data: this.productSet.get(productId) };
  }

  deleteProduct(productId: string) {
    this.getProduct(productId);

    this.productSet.delete(productId);

    return { data: { message: SUCCESS_MESSAGE.PRODUCT.DELETE } };
  }

  updateProduct(productId: string, productData: UpdateProductDto) {
    const existingProduct = this.getProduct(productId).data;

    const updatedProduct = {
      ...existingProduct,
      ...productData,
    };

    this.productSet.set(productId, {
      ...existingProduct,
      ...productData,
    });

    return { data: updatedProduct };
  }

  private filterProducts(
    products: CreateProductDto[],
    query: QueryProductDto,
  ): CreateProductDto[] {
    let filtered = [...products];

    if (query.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query.search),
      );
    }

    if (query.sortBy && query.order) {
      const key = query.sortBy;
      const direction = query.order === SortingOrder.asc ? 1 : -1;

      filtered.sort((a, b) => {
        if (a[key] < b[key]) return -1 * direction;
        if (a[key] > b[key]) return 1 * direction;
        return 0;
      });
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return filtered.slice(startIndex, endIndex);
  }
}
