import { AssetStatisticsResponse } from "../Stocks/asset-statistics-response";
import { OrderResponse } from "./order-response";

export interface AccountStockResponse {
    id: string;
    symbol: string;
    name: string;
    exchange: string;
    orders: OrderResponse[];
    assetStatistics: AssetStatisticsResponse | undefined;
}
