import { createAction, props } from "@ngrx/store";

import { AccountResponse } from "src/app/api/models/Accounts/account-response";

export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';
export const LOAD_ACCOUNTS = 'LOAD_ACCOUNTS';
export const SET_ACCOUNTS = 'SET_ACCOUNTS';
export const SELECT_ACCOUNT = 'SELECT_ACCOUNT';

export const AddAccountAction = createAction(ADD_ACCOUNT, props<{ account: AccountResponse }>());
export const UpdateAccountAction = createAction(UPDATE_ACCOUNT, props<{ account: AccountResponse }>());
export const DeleteAccountAction = createAction(DELETE_ACCOUNT, props<{ id: string }>());
export const LoadAccountsAction = createAction(LOAD_ACCOUNTS);
export const SetAccountsAction = createAction(SET_ACCOUNTS, props<{ accounts: AccountResponse[] }>());
export const SelectAccountAction = createAction(SELECT_ACCOUNT, props<{ account: AccountResponse }>());
