import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AccountResponse } from 'src/app/api/models/AccountApi/account-response';
import { AppState } from 'src/app/reducers/app.reducers';
import { AccountAddComponent } from '../account-add/account-add.component';
import { AccountEditComponent } from '../account-edit/account-edit.component';
import { LoadAccountsAction } from '../store/accounts.actions';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit, OnDestroy {
  accounts: AccountResponse[] = [];
  displayedColumns: string[] = ['name', 'description', 'createdDateTime', 'actions'];

  accountsSubscription!: Subscription;
  hasLoadedSubscription!: Subscription;

  constructor(private dialog: MatDialog, private store: Store<AppState>) { }

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
      }
    );
  }

  ngOnDestroy(): void {
    this.accountsSubscription.unsubscribe();
    this.hasLoadedSubscription.unsubscribe();
  }

  add(): void {
    this.dialog.open(AccountAddComponent, {
      width: '500px'
    });
  }

  edit(element: AccountResponse): void {
    this.dialog.open(AccountEditComponent, {
      width: '500px',
      data: { item: element }
    });
  }
}
