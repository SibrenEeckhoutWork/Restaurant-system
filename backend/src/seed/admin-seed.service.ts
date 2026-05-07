import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { ConfigService } from '@nestjs/config';
import { ALL_PERMISSIONS } from '../common/permissions.js';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config.getOrThrow<string>('ADMIN_EMAIL');

    const existing = await this.usersService.findByEmail(email);

    if (!existing) {
      const password = this.config.getOrThrow<string>('ADMIN_PASSWORD');
      await this.usersService.create({ email, password, firstName: 'Admin', lastName: 'User', permissions: ALL_PERMISSIONS });
      this.logger.log(`Admin user seeded: ${email}`);
      return;
    }

    const missing = ALL_PERMISSIONS.filter((p) => !existing.permissions.includes(p));
    if (missing.length > 0) {
      await this.usersService.update(existing.id, { permissions: ALL_PERMISSIONS });
      this.logger.log(`Admin permissions synced (added: ${missing.join(', ')})`);
    }
  }
}
