import { TransferType } from "./transfer-type";

export interface CreateTransferRequest {
    accountId: string;
    amount: number;
    dateTime: string;
    type: TransferType;
}
