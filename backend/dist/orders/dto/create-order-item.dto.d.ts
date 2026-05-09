export declare class OrderItemAccessoryDto {
    accessoryId: string;
    quantity: number;
}
export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
    notes?: string | null;
    accessories?: OrderItemAccessoryDto[];
}
