import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { LoadAccountsAction, SelectAccountAction } from 'src/app/accounts/store/accounts.actions';
import { AccountResponse } from 'src/app/api/models/AccountApi/account-response';
import { AppState } from 'src/app/reducers/app.reducers';

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.scss']
})
export class AccountSelectorComponent implements OnInit, OnDestroy {
  selectedAccount: AccountResponse = { name: '' };
  accounts: AccountResponse[] = [];

  accountsSubscription!: Subscription;
  hasLoadedSubscription!: Subscription;

  constructor(private store: Store<AppState>, private dialogRef: MatDialogRef<AccountResponse>) { }
  
  ngOnInit(): void {
    this.hasLoadedSubscription = this.store.select(state => state.accounts.hasLoaded).pipe(take(1)).subscribe(
      (hasLoaded: boolean) => {
        if (!hasLoaded)
          this.store.dispatch(LoadAccountsAction());
      }
    );
    this.accountsSubscription = this.store.subscribe(
      (state: AppState) => {
        this.accounts = state.accounts.accounts;
        this.selectedAccount = state.accounts.selectedAccount ?? this.selectedAccount;
      }
    );
  }

  ngOnDestroy(): void {
    this.accountsSubscription.unsubscribe();
    this.hasLoadedSubscription.unsubscribe();
  }

  accountSelected() {
    this.store.dispatch(SelectAccountAction({account: this.selectedAccount}));
    this.dialogRef.close();
  }
}
