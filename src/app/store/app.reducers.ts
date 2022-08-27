import { ActionReducerMap } from '@ngrx/store';

import { AccountsReducer, AccountsState } from '../accounts/store/accounts.reducers';
import { TransfersReducer, TransfersState } from '../transfers/store/transfers.reducers';

export interface AppState {
    accounts: AccountsState;
    transfers: TransfersState;
}

export const AppReducers: ActionReducerMap<AppState> = {
    accounts: AccountsReducer,
    transfers: TransfersReducer
};
