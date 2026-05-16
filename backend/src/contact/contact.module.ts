import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './contact-message.entity.js';
import { ContactService } from './contact.service.js';
import { ContactController } from './contact.controller.js';
import { TenantsModule } from '../tenants/tenants.module.js';
import { UsersModule } from '../users/users.module.js';
import { ModuleConfigModule } from '../module-config/module-config.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage]), TenantsModule, UsersModule, ModuleConfigModule],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
