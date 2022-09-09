import { OrderResponse } from "./order-response";

export interface AccountStockResponse {
    id: string;
    symbol: string;
    name: string;
    exchange: string;
    price: number;
    orders: OrderResponse[];
}
