import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}
  @Get(':id')
  /**
   * Finds a single vendor by its id.
   * @param id The id of the vendor to find.
   * @returns The vendor with the given id.
   */
  findOne(@Param('id') id: string) {
    return this.vendorService.findVendorById(id);
  }

  @Get(':id/products') 
  /**
   * Finds and returns all products associated with a vendor.
   * @param id The id of the vendor whose products are to be found.
   * @returns A promise that resolves to the list of products associated with the vendor.
   */
  findAllVendorProduct(@Param('id') id: string) {
    return this.vendorService.findVendorProducts(id);
  }

}
