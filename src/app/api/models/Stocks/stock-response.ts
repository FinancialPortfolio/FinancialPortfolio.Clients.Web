import { AssetStatisticsResponse } from "./asset-statistics-response";

export interface StockResponse {
    id: string;
    symbol: string;
    name: string;
    exchange: string;
    assetStatistics: AssetStatisticsResponse;
}
