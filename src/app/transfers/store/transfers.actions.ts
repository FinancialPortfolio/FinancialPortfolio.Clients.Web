import { createAction, props } from "@ngrx/store";

import { TransferResponse } from "src/app/api/models/Transfers/transfer-response";

export const ADD_TRANSFER = 'ADD_TRANSFER';
export const LOAD_TRANSFERS = 'LOAD_TRANSFERS';
export const SET_TRANSFERS = 'SET_TRANSFERS';


export const AddTransferAction = createAction(ADD_TRANSFER, props<{ transfer: TransferResponse }>());
export const LoadTransfersAction = createAction(LOAD_TRANSFERS);
export const SetTransfersAction = createAction(SET_TRANSFERS, props<{ transfers: TransferResponse[] }>());
