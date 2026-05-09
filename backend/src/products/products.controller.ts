import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CreateAllergyDto } from './dto/create-allergy.dto.js';
import { UpdateAllergyDto } from './dto/update-allergy.dto.js';
import { CreateAccessoryDto } from './dto/create-accessory.dto.js';
import { UpdateAccessoryDto } from './dto/update-accessory.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionGuard } from '../auth/guards/permission.guard.js';
import { RequirePermission } from '../auth/decorators/require-permission.decorator.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)

// ── Categories ────────────────────────────────────────────────────────────────
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @RequirePermission('categories.get')
  findAll() { return this.service.findAllCategories(); }

  @Get(':id')
  @RequirePermission('categories.get')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findCategoryById(id); }

  @Post()
  @RequirePermission('categories.create')
  create(@Body() dto: CreateCategoryDto) { return this.service.createCategory(dto); }

  @Patch(':id')
  @RequirePermission('categories.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.updateCategory(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('categories.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.removeCategory(id); }
}

// ── Allergies ─────────────────────────────────────────────────────────────────
@ApiTags('Allergies')
@Controller('allergies')
export class AllergiesController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @RequirePermission('allergies.get')
  findAll() { return this.service.findAllAllergies(); }

  @Get(':id')
  @RequirePermission('allergies.get')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findAllergyById(id); }

  @Post()
  @RequirePermission('allergies.create')
  create(@Body() dto: CreateAllergyDto) { return this.service.createAllergy(dto); }

  @Patch(':id')
  @RequirePermission('allergies.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAllergyDto) {
    return this.service.updateAllergy(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('allergies.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.removeAllergy(id); }
}

// ── Accessories ───────────────────────────────────────────────────────────────
@ApiTags('Accessories')
@Controller('accessories')
export class AccessoriesController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @RequirePermission('accessories.get')
  findAll() { return this.service.findAllAccessories(); }

  @Get(':id')
  @RequirePermission('accessories.get')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findAccessoryById(id); }

  @Post()
  @RequirePermission('accessories.create')
  create(@Body() dto: CreateAccessoryDto) { return this.service.createAccessory(dto); }

  @Patch(':id')
  @RequirePermission('accessories.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAccessoryDto) {
    return this.service.updateAccessory(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('accessories.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.removeAccessory(id); }
}

// ── Products ──────────────────────────────────────────────────────────────────
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @RequirePermission('products.get')
  findAll() { return this.service.findAllProducts(); }

  @Get(':id')
  @RequirePermission('products.get')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findProductById(id); }

  @Post()
  @RequirePermission('products.create')
  create(@Body() dto: CreateProductDto) { return this.service.createProduct(dto); }

  @Patch(':id')
  @RequirePermission('products.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.service.updateProduct(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('products.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.removeProduct(id); }
}
