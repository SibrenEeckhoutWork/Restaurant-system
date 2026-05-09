import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './order.entity.js';
import { OrderItem } from './order-item.entity.js';
import { Accessory } from '../products/accessory.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Accessory) private readonly accessoryRepo: Repository<Accessory>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: { table: true, items: { product: true, accessories: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: { table: true, items: { product: true, accessories: true } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepo.create({ tableId: dto.tableId });
    const saved = await this.orderRepo.save(order);

    const items = await this.buildItems(saved.id, dto.items);
    await this.itemRepo.save(items);

    return this.findById(saved.id);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findById(id);
    order.status = dto.status;
    await this.orderRepo.save(order);
    return this.findById(id);
  }

  async updateItems(id: string, dto: UpdateOrderItemsDto): Promise<Order> {
    await this.findById(id);
    await this.itemRepo.delete({ orderId: id });

    const items = await this.buildItems(id, dto.items);
    await this.itemRepo.save(items);

    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findById(id);
    await this.orderRepo.remove(order);
  }

  private async buildItems(orderId: string, itemDtos: CreateOrderDto['items']): Promise<OrderItem[]> {
    return Promise.all(
      itemDtos.map(async (dto) => {
        const accessories = dto.accessoryIds?.length
          ? await this.accessoryRepo.findBy({ id: In(dto.accessoryIds) })
          : [];
        const item = this.itemRepo.create({
          orderId,
          productId: dto.productId,
          quantity: dto.quantity,
          notes: dto.notes ?? null,
          accessories,
        });
        return item;
      }),
    );
  }
}
