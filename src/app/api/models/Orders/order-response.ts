import { OrderType } from "./order-type";
import { StockResponse } from "./stock-response";

export interface OrderResponse {
    id: string;
    type: OrderType;
    amount: number;
    price: number;
    dateTime: Date;
    commission: number;
    stock: StockResponse;
    accountId: string;
}
