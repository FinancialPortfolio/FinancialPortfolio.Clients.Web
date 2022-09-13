import { createReducer, on } from "@ngrx/store";
import { AccountResponse } from "src/app/api/models/Accounts/account-response";
import { AddAccountAction, DeleteAccountAction, SelectAccountAction, SetAccountsAction, UpdateAccountAction } from "./accounts.actions";

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
    on(UpdateAccountAction, (state: AccountsState, action) => {
        let account = action.account;
        let accounts = state.accounts.filter(a => a.id != account.id);
        return {
            ...state,
            accounts: [...accounts, account]
        }
    }),
    on(DeleteAccountAction, (state: AccountsState, action) => {
        let accounts = state.accounts.filter(a => a.id != action.id);
        return {
            ...state,
            accounts: [...accounts]
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
