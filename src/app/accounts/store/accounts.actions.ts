import { createAction, props } from "@ngrx/store";

import { AccountResponse } from "src/app/api/models/AccountApi/account-response";

export const AddAccountAction = createAction('ADD_ACCOUNT', props<{ account: AccountResponse}>());