import { createReducer, on } from "@ngrx/store";
import { AccountResponse } from "src/app/api/models/AccountApi/account-response";
import { AddAccountAction, SelectAccountAction, SetAccountsAction } from "./accounts.actions";

export interface AccountsState {
    hasLoaded: boolean;
    accounts: AccountResponse[];
    selectedAccount: AccountResponse | undefined;
}

const initialState: AccountsState = {
    hasLoaded: false,
    accounts: [],
    selectedAccount: undefined
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
    }),
    on(SelectAccountAction, (state: AccountsState, action) => {
        return {
            ...state,
            selectedAccount: action.account
        }
    })
);
