export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    isAvailable?: boolean;
    categoryId: string;
    allergyIds?: string[];
    accessoryIds?: string[];
}
