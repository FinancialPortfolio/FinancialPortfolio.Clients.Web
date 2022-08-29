import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { AccountsService } from 'src/app/api/services/accounts.service';
import { LoadingService } from 'src/app/core/services/LoadingService';
import { AppState } from 'src/app/store/app.reducers';
import { AccountAddComponent } from '../account-add/account-add.component';
import { AccountEditComponent } from '../account-edit/account-edit.component';

@Component({
    selector: 'app-account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit, OnDestroy {
    accounts: AccountResponse[] = [];
    displayedColumns: string[] = ['name', 'description', 'createdDateTime', 'actions'];

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private dialog: MatDialog,
        private store: Store<AppState>,
        private loadingService: LoadingService,
        private accountsService: AccountsService) { }

    ngOnInit(): void {
        this.loadingService.loadAccounts();

        this.store.pipe(takeUntil(this.unsubscribe)).subscribe( // TODO: try to use this.store.select('Accounts')
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

    delete(element: AccountResponse): void {
        this.accountsService.Delete(element.id)
            .subscribe(
                (response) => {
                    // TODO: add toastr
                    alert('Accepted');
                }
            );
    }
}
