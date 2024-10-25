import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from 'src/database/schemas/cart.schema';

@Injectable()
export class CartService {

  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

  /**
   * Finds a cart by its userId. If the cart is not found, it is created.
   * @param userId The id of the user to find the cart for.
   * @returns The cart for the given user.
   */
  async getCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      const newCart = new this.cartModel({ userId });
      newCart.save();
      return newCart;
    }
    return cart;
  }
  
  /**
   * Adds a product to the cart or updates the quantity and total price if it already exists.
   * 
   * @param cartId The id of the cart to add the product to.
   * @param productId The id of the product to add to the cart.
   * @param quantity The quantity of the product to add.
   * @param price The price of the product.
   * @throws NotFoundException if the cart is not found.
   */
  async addToCart(cartId: string, productId: string, quantity: number, price: number) {
    const cart = await this.cartModel.findById(cartId).populate('items.productId');
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items.find(item => item.productId.toString() === productId);
    
    if (cartItem) {
      cartItem.quantity = quantity; // this will always have the latest quantity 
      cartItem.totalPrice = (quantity) * price;
    } else {
      cart.items.push({ productId: new Types.ObjectId(productId), quantity, totalPrice: quantity * price });
    }
    // calculate total price of cart
    cart.totalPrice = cart.items.reduce((total, item) => total + item.totalPrice, 0);
    await cart.save();
  }

  /**
   * Removes a product from the cart.
   * 
   * @param cartId The id of the cart to remove the product from.
   * @param productId The id of the product to remove.
   * @throws NotFoundException if the cart or the product is not found.
   * @returns The updated cart.
   */
  async removeFromCart(cartId: string, productId: string) {
    const cart = await this.cartModel.findById(cartId).populate('items.productId');
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items.find(item => item.productId.toString() === productId);
    if (cartItem) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      // calculate total price of cart
      cart.totalPrice = cart.items.reduce((total, item) => total + item.totalPrice, 0);
      return await cart.save();
    } else {
      throw new NotFoundException('Cart item not found');
    }
  }

  /**
   * Clears all items from a cart.
   * 
   * @param cartId The id of the cart to clear.
   * @throws NotFoundException if the cart is not found.
   * @returns The updated cart.
   */
  async clearCart(cartId: string) {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    cart.items = [];
    cart.totalPrice = 0;
    return await cart.save();
  }
}
