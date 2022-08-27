import { createReducer, on } from "@ngrx/store";

import { TransferResponse } from "src/app/api/models/TransferApi/transfer-response";
import { AddTransferAction, SetTransfersAction } from "./transfers.actions";

export interface TransfersState {
    hasLoaded: boolean;
    transfers: TransferResponse[];
}

const initialState: TransfersState = {
    hasLoaded: false,
    transfers: []
};

export const TransfersReducer = createReducer(
    initialState,
    on(AddTransferAction, (state: TransfersState, action) => {
        return {
            ...state,
            transfers: [...state.transfers, action.transfer]
        }
    }),
    on(SetTransfersAction, (state: TransfersState, action) => {
        return {
            ...state,
            transfers: [...state.transfers, ...action.transfers],
            hasLoaded: true
        }
    })
);
