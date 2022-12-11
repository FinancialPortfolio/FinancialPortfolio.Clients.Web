import { StockStatisticsResponse } from "../Stocks/stock-statistics-response";
import { OrderResponse } from "./order-response";

export interface StockResponse {
    symbol: string;
    name: string;
    assetId: string;
    allocation: number;
    allocationInPercentage: number;
    expectedAllocation: number;
    stockStatistics: StockStatisticsResponse | undefined;
    orders: OrderResponse[];
}
