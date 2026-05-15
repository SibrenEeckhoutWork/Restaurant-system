import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { TenantsService } from '../tenants/tenants.service.js';
import { ConfigService } from '@nestjs/config';
import { ALL_PERMISSIONS } from '../common/permissions.js';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tenantsService: TenantsService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedSuperAdmin();
    await this.seedDefaultTenant();
  }

  private async seedSuperAdmin(): Promise<void> {
    const email = this.config.get<string>('SUPER_ADMIN_EMAIL');
    if (!email) return;

    const existing = await this.usersService.findSuperAdminByEmail(email);
    if (!existing) {
      const password = this.config.getOrThrow<string>('SUPER_ADMIN_PASSWORD');
      await this.usersService.create({
        email,
        password,
        firstName: 'Super',
        lastName: 'Admin',
        permissions: [],
        tenantId: null,
        isSuperAdmin: true,
      });
      this.logger.log(`Super admin seeded: ${email}`);
    }
  }

  private async seedDefaultTenant(): Promise<void> {
    const slug = this.config.get<string>('DEFAULT_TENANT_SLUG');
    const name = this.config.get<string>('DEFAULT_TENANT_NAME');
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    if (!slug || !name || !adminEmail) return;

    let tenant = await this.tenantsService.findBySlug(slug);
    if (!tenant) {
      tenant = await this.tenantsService.create({ name, slug });
      this.logger.log(`Default tenant seeded: ${slug}`);
    }

    const existing = await this.usersService.findByEmailInTenant(adminEmail, tenant.id);
    if (!existing) {
      const password = this.config.getOrThrow<string>('ADMIN_PASSWORD');
      await this.usersService.create({
        email: adminEmail,
        password,
        firstName: 'Admin',
        lastName: 'User',
        permissions: ALL_PERMISSIONS,
        tenantId: tenant.id,
      });
      this.logger.log(`Default tenant admin seeded: ${adminEmail}`);
      return;
    }

    const missing = ALL_PERMISSIONS.filter((p) => !existing.permissions.includes(p));
    if (missing.length > 0) {
      await this.usersService.update(existing.id, { permissions: ALL_PERMISSIONS });
      this.logger.log(`Default tenant admin permissions synced (added: ${missing.join(', ')})`);
    }
  }
}
