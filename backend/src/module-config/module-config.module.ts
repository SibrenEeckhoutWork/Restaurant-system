import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleConfig } from './module-config.entity.js';
import { ModuleConfigService } from './module-config.service.js';
import { ModuleConfigController } from './module-config.controller.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleConfig]), forwardRef(() => UsersModule)],
  providers: [ModuleConfigService],
  controllers: [ModuleConfigController],
  exports: [ModuleConfigService],
})
export class ModuleConfigModule {}
