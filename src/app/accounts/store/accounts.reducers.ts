import { createReducer, on } from "@ngrx/store";
import { AccountResponse } from "src/app/api/models/AccountApi/account-response";
import { AddAccountAction, SetAccountsAction } from "./accounts.actions";

export interface AccountsState {
    hasLoaded: boolean;
    accounts: AccountResponse[];
}

const initialState: AccountsState = {
    hasLoaded: false,
    accounts: []
};

export const AccountsReducer = createReducer(
    initialState,
    on(AddAccountAction, (state: AccountsState, action) => {
        return {
            ...state,
            accounts: [...state.accounts, action.account]
        }
    }),
    on(SetAccountsAction, (state: AccountsState, action) => {
        return {
            ...state,
            accounts: [...state.accounts, ...action.accounts],
            hasLoaded: true
        }
    })
);