import { AssetStatisticsResponse } from "./asset-statistics-response";

export interface AssetResponse {
    id: string;
    symbol: string;
    name: string;
    exchange: string;
    assetStatistics: AssetStatisticsResponse;
}
