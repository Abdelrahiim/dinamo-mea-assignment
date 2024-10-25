import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/database/schemas/order.schema';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    CartModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema }
    ])
  ],
})
export class OrderModule {}
