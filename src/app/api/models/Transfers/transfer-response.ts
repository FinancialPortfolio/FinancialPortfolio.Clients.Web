import { TransferType } from "./transfer-type";

export interface TransferResponse {
    id: string;
    amount: number;
    type: TransferType;
    accountId: string;
    dateTime: Date;
}
