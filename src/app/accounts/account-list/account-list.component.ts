import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AccountResponse } from 'src/app/api/models/AccountApi/account-response';
import { AppState } from 'src/app/store/app.reducers';
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

  private readonly unsubscribe: Subject<void> = new Subject();

  constructor(private dialog: MatDialog, private store: Store<AppState>) { }

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
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
