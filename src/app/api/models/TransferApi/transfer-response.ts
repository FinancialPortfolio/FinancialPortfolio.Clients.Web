/* tslint:disable */
/* eslint-disable */
import { TransferType as TransferApiTransferType } from '../TransferApi/transfer-type';
export interface TransferResponse {
  amount?: number;
  dateTime?: null | string;
  type?: TransferApiTransferType;
}
