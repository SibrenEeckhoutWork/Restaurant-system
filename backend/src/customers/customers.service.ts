import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Customer } from './customer.entity.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private readonly repo: Repository<Customer>,
  ) {}

  findAll(tenantId: string): Promise<Customer[]> {
    return this.repo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  findByEmail(email: string): Promise<Customer | null> {
    return this.repo.findOne({ where: { email } });
  }

  findByEmailInTenant(email: string, tenantId: string): Promise<Customer | null> {
    return this.repo.findOne({ where: { email, tenantId } });
  }

  findById(id: string): Promise<Customer | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: CreateCustomerDto | { name: string; email: string; password: string }, tenantId: string): Promise<Customer> {
    const existing = await this.findByEmailInTenant(data.email, tenantId);
    if (existing) throw new ConflictException('Email already in use');
    const password = await bcrypt.hash(data.password, 10);
    return this.repo.save(this.repo.create({ ...data, password, tenantId }));
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.repo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');

    if (dto.email && dto.email !== customer.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) throw new ConflictException('Email already in use');
    }

    const updates: Partial<Customer> = { ...dto } as Partial<Customer>;
    delete (updates as Record<string, unknown>).password;
    if (dto.password) updates.password = await bcrypt.hash(dto.password, 10);

    Object.assign(customer, updates);
    return this.repo.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.repo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    await this.repo.remove(customer);
  }

  async bulkRemove(ids: string[]): Promise<void> {
    const customers = await this.repo.find({ where: { id: In(ids) } });
    await this.repo.remove(customers);
  }

  async updateRefreshToken(id: string, hash: string | null): Promise<void> {
    await this.repo.update(id, { refreshTokenHash: hash });
  }
}
