import { Category } from './category.entity.js';
import { Allergy } from './allergy.entity.js';
import { Accessory } from './accessory.entity.js';
export declare class Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    isAvailable: boolean;
    categoryId: string;
    category: Category;
    allergies: Allergy[];
    accessories: Accessory[];
}
