import { ActionReducerMap } from '@ngrx/store';

import { AccountsReducer, AccountsState } from '../accounts/store/accounts.reducers';

export interface AppState {
    accounts: AccountsState;
}

export const AppReducers: ActionReducerMap<AppState> = {
    accounts: AccountsReducer
};
