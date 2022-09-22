export interface InvalidOrderResponse {
    symbol: string;
    exchange: string;
    currency: string;
    amount: number;
    price: number;
    dateTime: Date;
}
