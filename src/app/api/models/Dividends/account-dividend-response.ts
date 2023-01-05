import { DividendFrequency } from "./dividend-frequency";

export interface AccountDividendResponse {
    id: string;
    paymentDate: Date;
    exDate: Date;
    symbol: string;
    assetId: string;
    quantity: number;
    dividendPerShare: number;
    amount: number;
    frequency: DividendFrequency;
}
