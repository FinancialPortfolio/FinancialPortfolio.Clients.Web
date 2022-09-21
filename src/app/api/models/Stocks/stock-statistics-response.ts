export interface StockStatisticsResponse {
    currentPrice: number;
    retrievalDateTime: Date;
    earningsPerShare: number;
    beta: number;
    marketCapitalization: number;
    dividendYield: number;
    priceToBookValue: number;
    priceToEarningsValue: number;
    priceToSalesValue: number;
    logo: string;
}
