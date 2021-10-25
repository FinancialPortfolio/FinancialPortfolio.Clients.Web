import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { LoadAccountsAction, SelectAccountAction } from 'src/app/accounts/store/accounts.actions';
import { AccountResponse } from 'src/app/api/models/AccountApi/account-response';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.scss']
})
export class AccountSelectorComponent implements OnInit, OnDestroy {
  selectedAccount: AccountResponse = { name: '' };
  accounts: AccountResponse[] = [];

  private readonly unsubscribe: Subject<void> = new Subject();

  constructor(private store: Store<AppState>, private dialogRef: MatDialogRef<AccountResponse>) { }
  
  ngOnInit(): void {
    this.store.select(state => state.accounts.hasLoaded).pipe(take(1)).subscribe(
      (hasLoaded: boolean) => {
        if (!hasLoaded)
          this.store.dispatch(LoadAccountsAction());
      }
    );
    this.store.pipe(takeUntil(this.unsubscribe)).subscribe(
      (state: AppState) => {
        this.accounts = state.accounts.accounts;
        this.selectedAccount = state.accounts.selectedAccount ?? this.selectedAccount;
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  accountSelected() {
    this.store.dispatch(SelectAccountAction({account: this.selectedAccount}));
    this.dialogRef.close();
  }
}
