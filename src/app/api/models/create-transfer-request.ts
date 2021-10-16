/* tslint:disable */
/* eslint-disable */
import { TransferType } from './transfer-type';
export interface CreateTransferRequest {
  amount?: number;
  dateTime?: null | string;
  type?: TransferType;
}
