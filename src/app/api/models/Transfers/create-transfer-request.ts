import { TransferType } from "./transfer-type";

export interface CreateTransferRequest {
    amount: number;
    type: TransferType;
    dateTime?: Date;
    accountId: string;
}
