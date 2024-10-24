import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  /**
   * Create a new product
   * @param createProductDto The data to create a new product with
   * @returns The newly created product
   */
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  /**
   * Finds all products with the given page size and page number.
   * If `search` is given, it will filter the products by the given search term.
   * @param pageSize The number of products per page.
   * @param page The page number.
   * @param search The search term.
   * @returns The products that were found.
   */
  findAll(@Query('pageSize') pageSize: number = 0, @Query('page') page: number = 0, @Query('search') search?: string) {
    return this.productService.getProducts(pageSize, page, search);
  }


  @Get(':id')
  /**
   * Finds a single product by its id.
   * @param id The id of the product to find.
   * @returns The product with the given id.
   * @throws NotFoundException if the product is not found.
   */
  findOne(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  /**
   * Updates a product by its id.
   * @param id The id of the product to update.
   * @param updateProductDto The data to update the product with.
   * @throws NotFoundException if the product is not found.
   * @returns The updated product.
   */
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  /**
   * Removes a product by its id.
   * @param id The id of the product to remove.
   * @returns An object containing a message indicating the result of the operation.
   * @throws NotFoundException if the product is not found.
   */
  remove(@Param('id') id: string) {
    const message = this.productService.deleteProduct(id);
    return { message }
  }
}
