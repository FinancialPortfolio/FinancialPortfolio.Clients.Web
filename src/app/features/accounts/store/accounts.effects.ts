import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, filter, switchMap, mergeMap } from 'rxjs/operators';

import { AccountsService } from 'src/app/api/services/accounts.service';
import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
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
            this.accountsService.getAll().pipe(
                mergeMap((response: any) => {
                    let accounts = response.response;
                    let actions: any[] = [SetAccountsAction({ accounts })];

                    if (accounts && accounts.length > 0) {
                        let selectedAccount = accounts[0];

                        let selectedAccountId = localStorage.getItem('selectedAccount');
                        if (selectedAccountId)
                            selectedAccount = accounts.find((account: AccountResponse) => account.id == selectedAccountId);

                        actions.push(SelectAccountAction({ account: selectedAccount }))
                    }

                    return actions;
                })
            )
        )
    ));
}
