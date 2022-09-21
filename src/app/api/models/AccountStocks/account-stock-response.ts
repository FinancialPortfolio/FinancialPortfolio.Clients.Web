import { StockStatisticsResponse } from "../Stocks/stock-statistics-response";
import { OrderResponse } from "./order-response";

export interface AccountStockResponse {
    id: string;
    symbol: string;
    name: string;
    exchange: string;
    orders: OrderResponse[];
    stockStatistics: StockStatisticsResponse | undefined;
}
