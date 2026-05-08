import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './table.entity.js';
import { TablesService } from './tables.service.js';
import { TablesController } from './tables.controller.js';
import { UsersModule } from '../users/users.module.js';
import { ModuleConfigModule } from '../module-config/module-config.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Table]), UsersModule, ModuleConfigModule],
  providers: [TablesService],
  controllers: [TablesController],
  exports: [TablesService],
})
export class TablesModule {}
