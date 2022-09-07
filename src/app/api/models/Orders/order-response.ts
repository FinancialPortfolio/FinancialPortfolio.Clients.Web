import { OrderType } from "./order-type";

export interface OrderResponse {
    id: string;
    type: OrderType;
    amount: number;
    price: number;
    dateTime: Date;
    commission: number;
    assetId: string;
    accountId: string;
}
