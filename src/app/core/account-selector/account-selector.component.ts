import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SelectAccountAction } from 'src/app/accounts/store/accounts.actions';
import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { AppState } from 'src/app/store/app.reducers';
import { LoadingService } from '../services/LoadingService';

@Component({
    selector: 'app-account-selector',
    templateUrl: './account-selector.component.html',
    styleUrls: ['./account-selector.component.scss']
})
export class AccountSelectorComponent implements OnInit, OnDestroy {
    selectedAccount: AccountResponse = { name: "", description: "", id: "", createdDateTime: "", userId: "" };
    accounts: AccountResponse[] = [];

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private store: Store<AppState>, private LoadingService: LoadingService, private dialogRef: MatDialogRef<AccountResponse>) { }

    ngOnInit(): void {
        this.LoadingService.loadAccounts();

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
        this.store.dispatch(SelectAccountAction({ account: this.selectedAccount }));
        this.dialogRef.close();
    }
}
