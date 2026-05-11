import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { Category } from './category.entity.js';
import { Allergy } from './allergy.entity.js';
import { ProductsService } from './products.service.js';
import {
  ProductsController,
  CategoriesController,
  AllergiesController,
  MenuController,
} from './products.controller.js';
import { UsersModule } from '../users/users.module.js';
import { ModuleConfigModule } from '../module-config/module-config.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Allergy]),
    UsersModule,
    ModuleConfigModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController, CategoriesController, AllergiesController, MenuController],
  exports: [ProductsService],
})
export class ProductsModule {}
