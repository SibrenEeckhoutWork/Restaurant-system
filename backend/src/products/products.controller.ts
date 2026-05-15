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
  Query,
  UnauthorizedException,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionGuard } from '../auth/guards/permission.guard.js';
import { RequirePermission } from '../auth/decorators/require-permission.decorator.js';
import { CurrentTenantId } from '../auth/decorators/current-tenant-id.decorator.js';
import { TenantsService } from '../tenants/tenants.service.js';

// ── Public menu (no auth) ────────────────────────────────────────────────────
@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(
    private readonly service: ProductsService,
    private readonly tenantsService: TenantsService,
  ) {}

  @Get()
  async getMenu(@Query('tenantSlug') tenantSlug: string) {
    const tenant = await this.tenantsService.findBySlug(tenantSlug);
    if (!tenant || !tenant.isActive) throw new UnauthorizedException('Tenant not found');
    return this.service.findMenu(tenant.id);
  }
}

// ── Categories ────────────────────────────────────────────────────────────────
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @RequirePermission('categories.get')
  findAll(@CurrentTenantId() tenantId: string) { return this.service.findAllCategories(tenantId); }

  @Get(':id')
  @RequirePermission('categories.get')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.findCategoryById(id, tenantId);
  }

  @Post()
  @RequirePermission('categories.create')
  create(@Body() dto: CreateCategoryDto, @CurrentTenantId() tenantId: string) {
    return this.service.createCategory(dto, tenantId);
  }

  @Patch(':id')
  @RequirePermission('categories.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto, @CurrentTenantId() tenantId: string) {
    return this.service.updateCategory(id, dto, tenantId);
  }

  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('categories.delete')
  bulkDelete(@Body() body: { ids: string[] }, @CurrentTenantId() tenantId: string) {
    return this.service.bulkRemoveCategories(body.ids, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('categories.delete')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.removeCategory(id, tenantId);
  }
}

// ── Allergies ─────────────────────────────────────────────────────────────────
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiTags('Allergies')
@Controller('allergies')
export class AllergiesController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @RequirePermission('allergies.get')
  findAll(@CurrentTenantId() tenantId: string) { return this.service.findAllAllergies(tenantId); }

  @Get(':id')
  @RequirePermission('allergies.get')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.findAllergyById(id, tenantId);
  }

  @Post()
  @RequirePermission('allergies.create')
  create(@Body() dto: CreateAllergyDto, @CurrentTenantId() tenantId: string) {
    return this.service.createAllergy(dto, tenantId);
  }

  @Patch(':id')
  @RequirePermission('allergies.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAllergyDto, @CurrentTenantId() tenantId: string) {
    return this.service.updateAllergy(id, dto, tenantId);
  }

  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('allergies.delete')
  bulkDelete(@Body() body: { ids: string[] }, @CurrentTenantId() tenantId: string) {
    return this.service.bulkRemoveAllergies(body.ids, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('allergies.delete')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.removeAllergy(id, tenantId);
  }
}

// ── Products ──────────────────────────────────────────────────────────────────
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @RequirePermission('products.get')
  findAll(@CurrentTenantId() tenantId: string) { return this.service.findAllProducts(tenantId); }

  @Get(':id')
  @RequirePermission('products.get')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.findProductById(id, tenantId);
  }

  @Post()
  @RequirePermission('products.create')
  create(@Body() dto: CreateProductDto, @CurrentTenantId() tenantId: string) {
    return this.service.createProduct(dto, tenantId);
  }

  @Patch(':id')
  @RequirePermission('products.update')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto, @CurrentTenantId() tenantId: string) {
    return this.service.updateProduct(id, dto, tenantId);
  }

  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('products.delete')
  bulkDelete(@Body() body: { ids: string[] }, @CurrentTenantId() tenantId: string) {
    return this.service.bulkRemoveProducts(body.ids, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('products.delete')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentTenantId() tenantId: string) {
    return this.service.removeProduct(id, tenantId);
  }
}
