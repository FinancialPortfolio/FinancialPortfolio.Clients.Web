import { createReducer, on } from "@ngrx/store";
import { AccountResponse } from "src/app/api/models/AccountApi/account-response";
import { AddAccountAction } from "./accounts.actions";

export interface AccountsState {
    accounts: AccountResponse[];
}

const initialState: AccountsState = {
    accounts: []
};

export const AccountsReducer = createReducer(
    initialState,
    on(AddAccountAction, (state: AccountsState, action) => {
        return {
            ...state,
            accounts: [...state.accounts, action.account]
        }
    })
);