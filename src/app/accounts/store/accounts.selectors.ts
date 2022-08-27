import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/store/app.reducers";

export const selectSelectedAccount = createSelector(
    (state: AppState) => state.accounts.selectedAccount,
    account => account
);
