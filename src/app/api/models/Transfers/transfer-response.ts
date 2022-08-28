import { TransferType } from "./transfer-type";

export interface TransferResponse {
    accountId: string;
    amount: number;
    dateTime: string;
    id: string;
    type: TransferType;
}
