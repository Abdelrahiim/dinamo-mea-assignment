import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { VendorModule } from './vendor/vendor.module';
import { SharedModule } from './shared/shared.module';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './modules/order/order.module';
import { CartSchema } from './cart/entities/cart-entity';
import { CartItemSchema } from './cart/entities/cart-item.entity';
import { UserSchema } from './user/entities/user.entity';
import { VendorSchema } from './vendor/entities/vendor.entity';
import { ProductSchema } from './product/schema/product.model';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    ProductModule,
    VendorModule,
    SharedModule,
    CartModule,
    UserModule,
    OrderModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
