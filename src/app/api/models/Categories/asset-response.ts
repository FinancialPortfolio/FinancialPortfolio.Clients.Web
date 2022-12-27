import { AssetStatisticsResponse } from "../Assets/asset-statistics-response";
import { OrderResponse } from "./order-response";

export interface AssetResponse {
    symbol: string;
    name: string;
    type: string;
    assetId: string;
    allocation: number;
    allocationInPercentage: number;
    expectedAllocationInPercentage: number;
    assetStatistics: AssetStatisticsResponse | undefined;
    orders: OrderResponse[];
}
