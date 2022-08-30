import { TransferType } from "./transfer-type";

export interface UpdateTransferRequest {
    amount: number;
    type: TransferType;
    dateTime: Date;
    accountId: string;
}
