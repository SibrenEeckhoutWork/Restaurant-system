import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findAll(): Promise<User[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  count(): Promise<number> {
    return this.repo.count();
  }

  async create(data: CreateUserDto | { email: string; password: string; permissions: string[]; firstName?: string; lastName?: string }): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(data.password, 10);
    return this.repo.save(
      this.repo.create({
        ...data,
        password: hashed,
        firstName: ('firstName' in data && data.firstName) ? data.firstName : '',
        lastName: ('lastName' in data && data.lastName) ? data.lastName : '',
        isActive: ('isActive' in data && data.isActive !== undefined) ? data.isActive : true,
        permissions: data.permissions ?? [],
      }),
    );
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) throw new ConflictException('Email already in use');
    }

    const updates: Partial<User> = { ...dto } as Partial<User>;
    delete (updates as Record<string, unknown>).password;
    if (dto.password) updates.password = await bcrypt.hash(dto.password, 10);

    Object.assign(user, updates);
    return this.repo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.repo.remove(user);
  }

  async bulkRemove(ids: string[]): Promise<void> {
    const users = await this.repo.find({ where: { id: In(ids) } });
    await this.repo.remove(users);
  }

  async updateRefreshToken(id: string, hash: string | null): Promise<void> {
    await this.repo.update(id, { refreshTokenHash: hash });
  }
}
