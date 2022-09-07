import { OrderType } from "./order-type";

export interface UpdateOrderRequest {
    type: OrderType;
    amount: number;
    price: number;
    dateTime: Date;
    commission: number;
    assetId: string;
}
