import { AssetStatisticsResponse } from "../Stocks/asset-statistics-response";
import { OrderResponse } from "./order-response";

export interface StockResponse {
    symbol: string;
    name: string;
    assetId: string;
    allocation: number;
    allocationInPercentage: number;
    expectedAllocationInPercentage: number;
    assetStatistics: AssetStatisticsResponse | undefined;
    orders: OrderResponse[];
}
