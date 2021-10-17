import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom, filter, switchMap } from 'rxjs/operators';
import { AccountResponse } from 'src/app/api/models/AccountApi/account-response';

import { AccountsService } from "src/app/api/services";
import { LOAD_ACCOUNTS, SetAccountsAction } from './accounts.actions';
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
            this.accountsService.apiAccountsGet().pipe(
                map((accounts: AccountResponse[]) => SetAccountsAction({ accounts }))
            )
        )
        // TODO: add error handling here
    ));
}