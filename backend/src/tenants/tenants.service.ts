import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant, SiteConfig, SlotEntry, ColorConfig, FontConfig } from './tenant.entity.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto.js';
import { DEFAULT_SITE_CONFIG } from './default-site-config.js';

function normalizeSiteConfig(raw: Record<string, unknown>): SiteConfig {
  // Migrate primaryColor → colors.primary
  const colors: ColorConfig = { ...(raw.colors as ColorConfig) };
  if (!colors.primary && raw.primaryColor) {
    colors.primary = raw.primaryColor as string;
  }

  // Migrate string[] pages → SlotEntry[]
  const rawPages = (raw.pages ?? {}) as Record<string, unknown[]>;
  const pages: SiteConfig['pages'] = {};
  for (const [key, slots] of Object.entries(rawPages)) {
    pages[key as keyof typeof pages] = slots.map((s) =>
      typeof s === 'string' ? { type: s, variant: 'default' } : (s as SlotEntry),
    );
  }

  return { colors, fonts: raw.fonts as FontConfig | undefined, pages };
}

@Injectable()
export class TenantsService {
  constructor(@InjectRepository(Tenant) private readonly repo: Repository<Tenant>) {}

  findAll(): Promise<Tenant[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Tenant> {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Tenant not found');
    return t;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return this.repo.findOne({ where: { slug } });
  }

  count(): Promise<number> {
    return this.repo.count();
  }

  async create(dto: CreateTenantDto): Promise<Tenant> {
    const existing = await this.repo.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug already in use');
    return this.repo.save(this.repo.create({ ...dto, isActive: dto.isActive ?? true }));
  }

  async update(id: string, dto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findById(id);
    if (dto.slug && dto.slug !== tenant.slug) {
      const existing = await this.repo.findOne({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Slug already in use');
    }
    Object.assign(tenant, dto);
    return this.repo.save(tenant);
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findById(id);
    await this.repo.remove(tenant);
  }

  async getSiteConfig(id: string): Promise<SiteConfig> {
    const tenant = await this.findById(id);
    const raw = (tenant.siteConfig ?? DEFAULT_SITE_CONFIG) as Record<string, unknown>;
    return normalizeSiteConfig(raw);
  }

  async updateSiteConfig(id: string, dto: UpdateSiteConfigDto): Promise<SiteConfig> {
    const tenant = await this.findById(id);
    const existing = normalizeSiteConfig((tenant.siteConfig ?? {}) as Record<string, unknown>);
    tenant.siteConfig = {
      colors: dto.colors ?? existing.colors,
      fonts:  dto.fonts  ?? existing.fonts,
      pages:  dto.pages  ?? existing.pages,
    };
    await this.repo.save(tenant);
    return tenant.siteConfig as SiteConfig;
  }
}
