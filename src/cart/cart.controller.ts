import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { RemoveItemDto } from './dto/remove-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  getCart(@Query('userId') userId: string) { // TODO: Get it from token
    return this.cartService.getCart(userId);
  }

  @Get('clear/:cartId')
  clearCart(@Param('cartId') cartId: string) {
    return this.cartService.clearCart(cartId);
  }

  @Patch('add/:cartId')
  addToCart(@Param('cartId') cartId: string, @Body() { price, productId, quantity }: AddItemDto) {
    return this.cartService.addToCart(cartId, productId, quantity, price);
  }

  @Patch('remove/:cartId')
  removeFromCart(@Param('cartId') cartId: string, @Body() { productId }: RemoveItemDto) {
    return this.cartService.removeFromCart(cartId, productId);
  }
}
