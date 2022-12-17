import { AssetStatisticsResponse } from "../Assets/asset-statistics-response";
import { OrderResponse } from "./order-response";

export interface AccountAssetResponse {
    id: string;
    symbol: string;
    name: string;
    exchange: string;
    orders: OrderResponse[];
    assetStatistics: AssetStatisticsResponse | undefined;
}
