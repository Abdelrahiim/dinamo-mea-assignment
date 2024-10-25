import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../database/schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { Vendor } from 'src/database/schemas/vendor.schema';

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>
  ) {}

  /**
   * Creates a new product.
   * @param createProductDto The data to create the product with.
   * @returns The newly created product.
   * @throws BadRequestException if the product vendor does not exist.
   */
  async createProduct(createProductDto: CreateProductDto) {
    const product = new this.productModel(createProductDto);
    // Push the product to the vendor's products array
    const vendor = await this.vendorModel.findOneAndUpdate({ _id: product.vendorId }, { $push: { products: product._id } });
    console.log(vendor)
    return await product.save();
  }

  /**
   * Retrieve a list of products, with optional search and pagination
   *
   * @param pageSize The maximum number of products to return per page
   * @param page The page number to retrieve (1-indexed)
   * @param search An optional search string to filter the results by
   * @returns An object with the list of products and the total number of products that match the search query
   */
  async getProducts(pageSize: number, page: number, search?: string) {
    const query = {} as any;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categories: { $elemMatch: { name: { $regex: search, $options: 'i' } } } },
      ];
    }
    // Should also have the Recommendation algorithm but since I am not using it, I am not implementing it
    const products = await this.productModel.find(query).limit(pageSize).skip(pageSize * (page - 1));
    const totalProducts = await this.productModel.countDocuments(query);
    return {
      data: products,
      totalSize: totalProducts,
    }
  }

  /**
   * Finds a single product by id.
   * @param id The id of the product to find.
   * @throws NotFoundException if the product is not found.
   * @returns The product with the given id.
   */
  async getProductById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  /**
   * Updates a product by its id.
   * @param id The id of the product to update.
   * @param updateProductDto The data to update the product with.
   * @throws NotFoundException if the product is not found.
   * @returns The updated product.
   */
  async updateProduct(id: string, updateProductDto: UpdateProductDto) { 
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return updatedProduct;
  }

  /**
   * Deletes a product by its id.
   * @param id The id of the product to delete.
   * @throws NotFoundException if the product is not found.
   * @returns The deleted product.
   */
  async deleteProduct(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return "Product Deleted Successfully";
  }
}
