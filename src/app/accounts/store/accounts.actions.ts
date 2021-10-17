import { createAction, props } from "@ngrx/store";

import { AccountResponse } from "src/app/api/models/AccountApi/account-response";

export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export const LOAD_ACCOUNTS = 'LOAD_ACCOUNTS';
export const SET_ACCOUNTS = 'SET_ACCOUNTS';

export const AddAccountAction = createAction(ADD_ACCOUNT, props<{ account: AccountResponse}>());
export const LoadAccountsAction = createAction(LOAD_ACCOUNTS);
export const SetAccountsAction = createAction(SET_ACCOUNTS, props<{ accounts: AccountResponse[]}>());
