import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity.js';
import { OrderItem } from './order-item.entity.js';
import { OrderItemAccessory } from './order-item-accessory.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto.js';
import { CreateOrderItemDto } from './dto/create-order-item.dto.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(OrderItemAccessory) private readonly itemAccRepo: Repository<OrderItemAccessory>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: { table: true, items: { product: { accessories: true, category: true }, accessories: { accessory: true } } },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: { table: true, items: { product: { accessories: true, category: true }, accessories: { accessory: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = await this.orderRepo.save(this.orderRepo.create({ tableId: dto.tableId }));
    await this.saveItems(order.id, dto.items);
    return this.findById(order.id);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findById(id);
    order.status = dto.status;
    await this.orderRepo.save(order);
    const kitchenStatuses = [OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY] as const;
    if ((kitchenStatuses as readonly string[]).includes(dto.status)) {
      await this.itemRepo.update({ orderId: id }, { itemStatus: dto.status as 'pending' | 'preparing' | 'ready' });
    }
    return this.findById(id);
  }

  async updateItems(id: string, dto: UpdateOrderItemsDto): Promise<Order> {
    await this.findById(id);
    const existing = await this.itemRepo.find({ where: { orderId: id } });
    await this.itemRepo.remove(existing);
    await this.saveItems(id, dto.items);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findById(id);
    await this.orderRepo.remove(order);
  }

  async bulkRemove(ids: string[]): Promise<void> {
    await this.orderRepo.delete({ id: In(ids) });
  }

  private async saveItems(orderId: string, itemDtos: CreateOrderItemDto[]): Promise<void> {
    for (const dto of itemDtos) {
      const item = await this.itemRepo.save(
        this.itemRepo.create({
          orderId,
          productId: dto.productId,
          quantity: dto.quantity,
          notes: dto.notes ?? null,
        }),
      );
      if (dto.accessories?.length) {
        await this.itemAccRepo.save(
          dto.accessories.map((a) =>
            this.itemAccRepo.create({
              orderItemId: item.id,
              accessoryId: a.accessoryId,
              quantity: a.quantity,
            }),
          ),
        );
      }
    }
  }

  async updateItemStatus(
    orderId: string,
    itemId: string,
    status: 'pending' | 'preparing' | 'ready',
  ): Promise<Order> {
    await this.itemRepo.update({ id: itemId, orderId }, { itemStatus: status });

    const order = await this.findById(orderId);
    const statuses = order.items.map((i) => i.itemStatus);

    let next = order.status;
    if (statuses.every((s) => s === 'ready') && order.status !== OrderStatus.READY) {
      next = OrderStatus.READY;
    } else if (statuses.some((s) => s !== 'pending') && order.status === OrderStatus.PENDING) {
      next = OrderStatus.PREPARING;
    }

    if (next !== order.status) {
      order.status = next;
      await this.orderRepo.save(order);
    }

    return this.findById(orderId);
  }
}
