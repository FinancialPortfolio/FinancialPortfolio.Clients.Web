import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { AppState } from 'src/app/store/app.reducers';
import { AccountSelectorComponent } from '../../account-selector/account-selector.component';
import { LoadingService } from '../../services/LoadingService';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
    @Output() sidebarClosed = new EventEmitter();
    selectedAccount: AccountResponse = { name: "", description: "", id: "", createdDateTime: "", userId: "" };

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private dialog: MatDialog, private store: Store<AppState>, private LoadingService: LoadingService) {
    }

    ngOnInit(): void {
        this.LoadingService.loadAccounts();

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
