import { StockStatisticsResponse } from "./stock-statistics-response";

export interface StockResponse {
    id: string;
    symbol: string;
    name: string;
    exchange: string;
    stockStatistics: StockStatisticsResponse;
}
