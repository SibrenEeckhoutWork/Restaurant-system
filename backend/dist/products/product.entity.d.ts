import { Category } from './category.entity.js';
import { Allergy } from './allergy.entity.js';
export declare class Product {
    id: string;
    tenantId: string;
    name: string;
    description: string | null;
    price: number;
    isAvailable: boolean;
    categoryId: string;
    category: Category;
    allergies: Allergy[];
    accessories: Product[];
}
