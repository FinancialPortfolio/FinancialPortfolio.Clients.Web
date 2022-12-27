import { AssetStatisticsResponse } from "./asset-statistics-response";

export interface AssetResponse {
    id: string;
    symbol: string;
    name: string;
    type: string;
    exchange: string;
    assetStatistics: AssetStatisticsResponse;
}
