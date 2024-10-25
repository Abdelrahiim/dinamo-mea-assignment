import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from '../user/gaurd/jwt.gaurd';
import { GetUser } from '../user/decorator/get-user.decortator';

@UseGuards(JwtGuard)
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
  async createOrder(@GetUser('_id') userId: string, createOrderDto: CreateOrderDto) { // TODO: Get it from token
    return this.orderService.createOrder(userId, createOrderDto);
  }

  @Get(':orderId')
  /**
   * Retrieves an order by its id.
   * @param orderId The id of the order to retrieve.
   * @returns The order with the given id.
   */
  async getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @Get('')
  /**
   * Retrieves all orders for the given user.
   * @param userId The id of the user to retrieve orders for.
   * @returns The orders for the given user.
   */
  async getOrders(@GetUser('_id') userId: string) {
    return this.orderService.getOrdersByUser(userId);
  }

  
}
