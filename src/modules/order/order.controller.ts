import { Controller, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  /**
   * Creates a new order for the given user.
   * @param userId The id of the user to create the order for.
   * @param createOrderDto The data to create the order with.
   * @returns The newly created order.
   */
  async createOrder(@Query('userId') userId: string, createOrderDto: CreateOrderDto) { // TODO: Get it from token
    return this.orderService.createOrder(userId, createOrderDto);
  }

  @Get(':orderId')
  /**
   * Retrieves an order by its id.
   * @param orderId The id of the order to retrieve.
   * @returns The order with the given id.
   */
  async getOrders(@Query('orderId') orderId: string) {
    return this.orderService.getOrders(orderId);
  }
}
