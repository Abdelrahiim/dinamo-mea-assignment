import { ConflictException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorService {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<Vendor>) {}

  /**
   * Creates a new vendor.
   * @param createVendorDto The data to create the vendor with.
   * @returns A promise that resolves to the created vendor.
   */
  async createVendor(createVendorDto: CreateVendorDto) {
    try {
      const vendor = new this.vendorModel(createVendorDto);
      return await vendor.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Vendor with the same name already exists.');
      }
      throw err;
    }
  }
  /**
   * Finds a vendor by its id and populates its associated products.
   * @param id The id of the vendor to find.
   * @returns A promise that resolves to the vendor with populated products.
   */
  findVendorProducts(id: string) {
    return this.vendorModel.findById(id).populate('products');
  }

  /**
   * Finds a vendor by its id.
   * @param id The id of the vendor to find.
   * @returns A promise that resolves to the vendor.
   */
  findVendorById(id: string) {
    return this.vendorModel.findById(id).select('-products');
  }

}
