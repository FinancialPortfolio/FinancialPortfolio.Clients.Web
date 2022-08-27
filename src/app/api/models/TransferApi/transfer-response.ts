/* tslint:disable */
/* eslint-disable */
import { TransferType as TransferApiTransferType } from '../TransferApi/transfer-type';
export interface TransferResponse {
    accountId?: null | string;
    amount?: number;
    dateTime?: null | string;
    id?: null | string;
    type?: TransferApiTransferType;
}
