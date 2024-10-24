import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from './entities/vendor.entity';

@Injectable()
export class VendorService {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<Vendor>) {}

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
