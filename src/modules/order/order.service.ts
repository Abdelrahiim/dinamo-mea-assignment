import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/database/schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly cartService: CartService,
  ) {}

  /**
   * Creates a new order for the given user.
   * @param userId The id of the user for whom to create the order.
   * @param createOrderDto The data to create the order with.
   * @returns The newly created order.
   */
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const cart = await this.cartService.getCart(userId);
    if (cart.items.length === 0) {
      throw new ForbiddenException('Cart is empty');
    }

    const order = await this.orderModel.create({
      orderItems: cart.items,
      totalItemsPrice: cart.totalPrice,
      userId: userId,
      shippingAddress: createOrderDto.shippingAddress,
      shippingPrice: createOrderDto.shippingPrice,
      totalPrice: cart.totalPrice + createOrderDto.shippingPrice,
    });

    await this.cartService.clearCart(cart._id.toString());
    return order;
  }

  /**
   * Retrieves an order by its id.
   * @param orderId The id of the order to retrieve.
   * @returns The order with the given id.
   */
  getOrderById(orderId: string) {
    return this.orderModel.findById(orderId);
  }

  /**
   * Retrieves all orders for the given user.
   * @param userId The id of the user to retrieve orders for.
   * @returns The orders for the given user.
   */
  getOrdersByUser(userId: string) {
    return this.orderModel.find({ userId: userId });
  }


  cancelOrderById(orderId: string) {
    return this.getOrderById(orderId).updateOne({ status: 'cancelled' });
  }
}
