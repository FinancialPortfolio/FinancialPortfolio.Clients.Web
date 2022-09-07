import { OrderType } from "./order-type";

export interface CreateOrderRequest {
    type: OrderType;
    amount: number;
    price: number;
    dateTime: Date;
    commission: number;
    assetId: string;
}
