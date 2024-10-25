import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { RemoveItemDto } from './dto/remove-item.dto';
import { JwtGuard } from '../user/gaurd/jwt.gaurd';
import { GetUser } from '../user/decorator/get-user.decortator';
@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  getCart(@GetUser('_id') userId: string) { // TODO: Get it from token
    return this.cartService.getCart(userId);
  }

  @Get(':cartId/clear')
  clearCart(@Param('cartId') cartId: string) {
    return this.cartService.clearCart(cartId);
  }

  @Patch(':cartId/add')
  addToCart(@Param('cartId') cartId: string, @Body() { price, productId, quantity }: AddItemDto) {
    return this.cartService.addToCart(cartId, productId, quantity, price);
  }

  @Patch(':cartId/remove')
  removeFromCart(@Param('cartId') cartId: string, @Body() { productId }: RemoveItemDto) {
    return this.cartService.removeFromCart(cartId, productId);
  }
}
