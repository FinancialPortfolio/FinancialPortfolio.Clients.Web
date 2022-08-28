import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, filter, switchMap, mergeMap } from 'rxjs/operators';
import { AccountResponse } from 'src/app/api/models/AccountApi/account-response';

import { AccountsService } from "src/app/api/services";
import { LOAD_ACCOUNTS, SelectAccountAction, SetAccountsAction } from './accounts.actions';
import { AccountsState } from './accounts.reducers';

@Injectable()
export class AccountsEffects {
    constructor(
        private actions$: Actions,
        private store: Store<AccountsState>,
        private accountsService: AccountsService) {
    }

    loadAccounts = createEffect(() => this.actions$.pipe(
        ofType(LOAD_ACCOUNTS),
        withLatestFrom(this.store),
        filter(([_, state]) => !state.hasLoaded),
        switchMap(() =>
            this.accountsService.apiAccountsFindPost({ body: { filteringOptions: {} } }).pipe(
                mergeMap((response: any) => {
                    let accounts = response.response;
                    let actions: any[] = [SetAccountsAction({ accounts })];

                    if (accounts && accounts.length > 0)
                        actions.push(SelectAccountAction({ account: accounts[0] }))

                    return actions;
                })
            )
        )
        // TODO: add error handling here
    ));
}
