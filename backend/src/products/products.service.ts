import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity.js';
import { Category } from './category.entity.js';
import { Allergy } from './allergy.entity.js';
import { Accessory } from './accessory.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CreateAllergyDto } from './dto/create-allergy.dto.js';
import { UpdateAllergyDto } from './dto/update-allergy.dto.js';
import { CreateAccessoryDto } from './dto/create-accessory.dto.js';
import { UpdateAccessoryDto } from './dto/update-accessory.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Allergy) private readonly allergyRepo: Repository<Allergy>,
    @InjectRepository(Accessory) private readonly accessoryRepo: Repository<Accessory>,
  ) {}

  // ── Categories ────────────────────────────────────────────────────────────

  findAllCategories(): Promise<Category[]> {
    return this.categoryRepo.find({ order: { sortOrder: 'ASC', name: 'ASC' } });
  }

  async findCategoryById(id: string): Promise<Category> {
    const c = await this.categoryRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Category not found');
    return c;
  }

  createCategory(dto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepo.save(this.categoryRepo.create({ ...dto, sortOrder: dto.sortOrder ?? 0 }));
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const c = await this.findCategoryById(id);
    Object.assign(c, dto);
    return this.categoryRepo.save(c);
  }

  async removeCategory(id: string): Promise<void> {
    const c = await this.findCategoryById(id);
    await this.categoryRepo.remove(c);
  }

  // ── Allergies ─────────────────────────────────────────────────────────────

  findAllAllergies(): Promise<Allergy[]> {
    return this.allergyRepo.find({ order: { name: 'ASC' } });
  }

  async findAllergyById(id: string): Promise<Allergy> {
    const a = await this.allergyRepo.findOne({ where: { id } });
    if (!a) throw new NotFoundException('Allergy not found');
    return a;
  }

  createAllergy(dto: CreateAllergyDto): Promise<Allergy> {
    return this.allergyRepo.save(this.allergyRepo.create({ ...dto, icon: dto.icon ?? null }));
  }

  async updateAllergy(id: string, dto: UpdateAllergyDto): Promise<Allergy> {
    const a = await this.findAllergyById(id);
    Object.assign(a, dto);
    return this.allergyRepo.save(a);
  }

  async removeAllergy(id: string): Promise<void> {
    const a = await this.findAllergyById(id);
    await this.allergyRepo.remove(a);
  }

  // ── Accessories ───────────────────────────────────────────────────────────

  findAllAccessories(): Promise<Accessory[]> {
    return this.accessoryRepo.find({ order: { name: 'ASC' } });
  }

  async findAccessoryById(id: string): Promise<Accessory> {
    const a = await this.accessoryRepo.findOne({ where: { id } });
    if (!a) throw new NotFoundException('Accessory not found');
    return a;
  }

  createAccessory(dto: CreateAccessoryDto): Promise<Accessory> {
    return this.accessoryRepo.save(this.accessoryRepo.create(dto));
  }

  async updateAccessory(id: string, dto: UpdateAccessoryDto): Promise<Accessory> {
    const a = await this.findAccessoryById(id);
    Object.assign(a, dto);
    return this.accessoryRepo.save(a);
  }

  async removeAccessory(id: string): Promise<void> {
    const a = await this.findAccessoryById(id);
    await this.accessoryRepo.remove(a);
  }

  // ── Products ──────────────────────────────────────────────────────────────

  findAllProducts(): Promise<Product[]> {
    return this.productRepo.find({
      relations: { category: true, allergies: true, accessories: true },
      order: { name: 'ASC' },
    });
  }

  async findProductById(id: string): Promise<Product> {
    const p = await this.productRepo.findOne({
      where: { id },
      relations: { category: true, allergies: true, accessories: true },
    });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const allergies = dto.allergyIds?.length
      ? await this.allergyRepo.findBy({ id: In(dto.allergyIds) })
      : [];
    const accessories = dto.accessoryIds?.length
      ? await this.accessoryRepo.findBy({ id: In(dto.accessoryIds) })
      : [];

    const product = this.productRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      isAvailable: dto.isAvailable ?? true,
      categoryId: dto.categoryId,
      allergies,
      accessories,
    });
    return this.productRepo.save(product);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findProductById(id);

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description ?? null;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.isAvailable !== undefined) product.isAvailable = dto.isAvailable;
    if (dto.categoryId !== undefined) product.categoryId = dto.categoryId;
    if (dto.allergyIds !== undefined) {
      product.allergies = dto.allergyIds.length
        ? await this.allergyRepo.findBy({ id: In(dto.allergyIds) })
        : [];
    }
    if (dto.accessoryIds !== undefined) {
      product.accessories = dto.accessoryIds.length
        ? await this.accessoryRepo.findBy({ id: In(dto.accessoryIds) })
        : [];
    }

    return this.productRepo.save(product);
  }

  async removeProduct(id: string): Promise<void> {
    const product = await this.findProductById(id);
    await this.productRepo.remove(product);
  }
}
