import { OrderType } from "./order-type";
import { AssetResponse } from "./asset-response";

export interface OrderResponse {
    id: string;
    type: OrderType;
    amount: number;
    price: number;
    dateTime: Date;
    commission: number;
    asset: AssetResponse;
    accountId: string;
}
