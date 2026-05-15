import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Category } from '../products/category.entity.js';
import { Product } from '../products/product.entity.js';
import { TenantsService } from '../tenants/tenants.service.js';

interface ProductSeed {
  naam: string;
  beschrijving?: string;
  prijs: number;
  voor?: string;
  noot?: string;
  opties?: { naam: string; meerprijs: number }[];
}

interface CategorySeed {
  naam: string;
  sortOrder: number;
  noot?: string;
  producten: ProductSeed[];
}

const ONTBIJT_MENU: CategorySeed[] = [
  {
    naam: 'Pancake ontbijt',
    sortOrder: 10,
    noot: 'Filterkoffie, warme chocomelk of thee inbegrepen',
    producten: [
      {
        naam: 'American pancake ontbijt',
        beschrijving: '4 pancakes met pancakesiroop en boter, 2 koppen filterkoffie. Optie: extra vers fruitsap (+€4,70)',
        prijs: 11.0,
      },
      {
        naam: 'Blueberry Pancake ontbijt',
        beschrijving: '4 blueberry pancakes met pancakesiroop, 2 koppen filterkoffie. Optie: extra vers fruitsap (+€4,70)',
        prijs: 12.0,
      },
      {
        naam: 'Bacon Pancake ontbijt',
        beschrijving: '4 pancakes met pancakesiroop en knapperig spek, 2 koppen filterkoffie. Optie: extra vers fruitsap (+€4,70)',
        prijs: 14.0,
      },
    ],
  },
  {
    naam: 'Ovenvers ontbijt',
    sortOrder: 20,
    noot: 'Filterkoffie, warme chocomelk of thee inbegrepen',
    producten: [
      {
        naam: 'Klein ontbijt',
        beschrijving: 'Fruitsap, 2 koppen filterkoffie, assortiment koekjes en pistoletjes, boter, confituur, zelfgemaakte peperkoek en vers fruit',
        prijs: 13.8,
      },
      {
        naam: 'Verwenontbijt',
        beschrijving: 'Klein ontbijt + roerei of spiegelei, ham, kaas en yoghurt',
        prijs: 19.0,
      },
      {
        naam: 'Weverkesontbijt',
        beschrijving: 'Verwenontbijt + glaasje cava en pancakes',
        prijs: 25.4,
      },
      {
        naam: 'De Stevige Starter',
        beschrijving: 'Pancakes, spek, brood, roerei, fruit, filterkoffie — voor 2 personen',
        prijs: 42.0,
      },
    ],
  },
  {
    naam: "Extra's",
    sortOrder: 30,
    producten: [
      { naam: 'Vers sinaasappelsap', prijs: 4.7 },
      { naam: 'Glaasje cava', prijs: 6.0 },
      { naam: 'Portie pancakes (2st)', prijs: 4.5 },
      { naam: 'Portie wentelteefjes (3st)', prijs: 4.5 },
      { naam: 'Bordje kaas & hesp', prijs: 4.5 },
      { naam: 'Spek', prijs: 4.0 },
      { naam: 'Bordje gerookte zalm', prijs: 7.0 },
      { naam: 'Andere warme drank', beschrijving: '2e drank aan de prijs op de kaart', prijs: 2.5 },
      { naam: 'Spiegelei / roerei', prijs: 3.0 },
      { naam: 'Extra koffie bijschenken', prijs: 1.5 },
    ],
  },
  {
    naam: 'Ontbijtbuffet op zondag',
    sortOrder: 40,
    producten: [
      {
        naam: 'Ontbijtbuffet zondag',
        beschrijving:
          'Glaasje cava, koffie, eitjes, pancakes en wentelteefjes naar believen. Vers fruit, yoghurt, granola, homemade peperkoek, confituurtjes, zoet en hartig beleg. Sapjes, koffie en thee naar believen. Op zondag serveren wij enkel dit ontbijt.',
        prijs: 29.0,
      },
    ],
  },
  {
    naam: "Kid's ontbijt",
    sortOrder: 50,
    producten: [
      {
        naam: "Kid's ontbijt",
        beschrijving: 'Chocomelk of Fristi, poffertjes, mini sandwich, mini koekje, kinder ei. Verkrijgbaar tot 10:30, niet verkrijgbaar op zondag.',
        prijs: 15.0,
      },
    ],
  },
  {
    naam: 'Ontbijtboxen',
    sortOrder: 60,
    producten: [
      {
        naam: 'Vaderdag ontbijt 1 persoon',
        beschrijving:
          'Fruitsap, koekjes, chocolade, huisgemaakte peperkoek, boter, choco en huisgemaakte confituur, yoghurt met aardbeien, zachte Franse brioche, klein krokant rustiek stokbroodje, mini boter croissant',
        prijs: 30.0,
      },
      {
        naam: 'Vaderdag ontbijt 2 personen',
        beschrijving:
          'Fruitsap, koekjes, chocolade, huisgemaakte peperkoek, boter, choco en huisgemaakte confituur, yoghurt met aardbeien, zachte Franse brioche, klein krokant rustiek stokbroodje, mini boter croissant',
        prijs: 60.0,
      },
      {
        naam: 'Kids ontbijt vaderdag',
        beschrijving: 'Pancake met snoepjes, mini donut, brioche, mini croissant, chocomelk, kinder eitje, snoepgoed, fruit',
        prijs: 15.0,
      },
      {
        naam: 'Ontbijtbox 1 pers glutenvrij',
        beschrijving:
          'Flesje vers sinaasappelsap, zakje glutenvrije koekjes, chocolade, super lekkere pannenkoek, wentelteefjes, roereitjes met spek, zoet en hartig beleg, assortiment ovenverse pistoletjes en koeken. Glutenvrij.',
        prijs: 35.0,
      },
      {
        naam: 'Pannenkoeken',
        beschrijving: 'Per kilo',
        prijs: 12.0,
      },
      {
        naam: 'American Pancakes',
        beschrijving: 'Per kilo',
        prijs: 14.0,
      },
      {
        naam: 'Poffertjes',
        beschrijving: 'Per 500 gr',
        prijs: 7.0,
      },
    ],
  },
];

@Injectable()
export class MenuSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MenuSeedService.name);

  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly tenantsService: TenantsService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const slug = this.config.get<string>('DEFAULT_TENANT_SLUG');
    if (!slug) return;
    const tenant = await this.tenantsService.findBySlug(slug);
    if (!tenant) return;

    for (const categorySeed of ONTBIJT_MENU) {
      const category = await this.upsertCategory(categorySeed, tenant.id);
      for (const productSeed of categorySeed.producten) {
        await this.upsertProduct(productSeed, category, tenant.id);
      }
    }
  }

  private async upsertCategory(seed: CategorySeed, tenantId: string): Promise<Category> {
    const existing = await this.categoryRepo.findOne({ where: { name: seed.naam, tenantId } });
    if (existing) return existing;

    const category = this.categoryRepo.create({ name: seed.naam, sortOrder: seed.sortOrder, tenantId });
    const saved = await this.categoryRepo.save(category);
    this.logger.log(`Categorie aangemaakt: ${seed.naam}`);
    return saved;
  }

  private async upsertProduct(seed: ProductSeed, category: Category, tenantId: string): Promise<void> {
    const existing = await this.productRepo.findOne({
      where: { name: seed.naam, categoryId: category.id, tenantId },
    });
    if (existing) return;

    const product = this.productRepo.create({
      name: seed.naam,
      description: seed.beschrijving ?? null,
      price: seed.prijs,
      isAvailable: true,
      categoryId: category.id,
      tenantId,
      allergies: [],
      accessories: [],
    });
    await this.productRepo.save(product);
    this.logger.log(`Product aangemaakt: ${seed.naam}`);
  }
}
