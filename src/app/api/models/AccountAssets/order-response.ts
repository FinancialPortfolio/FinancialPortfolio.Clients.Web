import { OrderType } from "../Orders/order-type";

export interface OrderResponse {
    id: string;
    type: OrderType;
    amount: number;
    price: number;
    dateTime: Date;
    commission: number;
    accountId: string;
}
