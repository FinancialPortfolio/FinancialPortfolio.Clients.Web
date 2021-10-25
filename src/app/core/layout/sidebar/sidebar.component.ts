import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LoadAccountsAction } from 'src/app/accounts/store/accounts.actions';
import { AccountResponse } from 'src/app/api/models/AccountApi/account-response';
import { AppState } from 'src/app/store/app.reducers';
import { AccountSelectorComponent } from '../../account-selector/account-selector.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output() sidebarClosed = new EventEmitter();
  selectedAccount: AccountResponse = { name: '' };

  private readonly unsubscribe: Subject<void> = new Subject();

  constructor(private dialog: MatDialog, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.select(state => state.accounts.hasLoaded).pipe(take(1)).subscribe(
      (hasLoaded: boolean) => {
        if (!hasLoaded)
          this.store.dispatch(LoadAccountsAction());
      }
    );
    this.store.pipe(takeUntil(this.unsubscribe)).subscribe(
      (state: AppState) => {
        this.selectedAccount = state.accounts.selectedAccount ?? this.selectedAccount;
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  closeSidebar() {
    this.sidebarClosed.emit();
  }

  selectAccount() {
    this.dialog.open(AccountSelectorComponent, {
      width: '350px'
    });
  }
}
