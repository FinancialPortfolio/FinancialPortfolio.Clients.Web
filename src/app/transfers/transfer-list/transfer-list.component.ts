import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { TransferResponse } from 'src/app/api/models/Transfers/transfer-response';
import { TransfersService } from 'src/app/api/services/transfers.service';
import { TransferAddComponent } from '../transfer-add/transfer-add.component';
import { TransferEditComponent } from '../transfer-edit/transfer-edit.component';
import { GetTransfersRequest } from 'src/app/api/models/Transfers/get-transfers-request';
import { SortOrder } from 'src/app/api/models/Shared/Search/Sorting/sort-order';
import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { AppState } from 'src/app/store/app.reducers';

@Component({
    selector: 'app-transfer-list',
    templateUrl: './transfer-list.component.html',
    styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit {
    transfers: TransferResponse[] = [];
    displayedColumns: string[] = ['amount', 'dateTime', 'type', 'actions'];
    totalSize = 0;

    pageNumber = 0;
    pageSize = 10;

    sortField = "DateTime";
    sortOrder = SortOrder.Desc;

    selectedAccount: AccountResponse | undefined;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private dialog: MatDialog,
        private store: Store<AppState>,
        private transfersService: TransfersService) { }

    ngOnInit(): void {
        this.store.pipe(takeUntil(this.unsubscribe)).subscribe(
            (state: AppState) => {
                this.selectedAccount = state.accounts.selectedAccount;

                this.loadTransfers();
            }
        );
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadTransfers(): void {
        if (!this.selectedAccount)
            return;

        let request: GetTransfersRequest = {
            pagination: {
                pageSize: this.pageSize,
                pageNumber: this.pageNumber + 1
            },
            sorting: {
                field: this.sortField,
                order: this.sortOrder
            }
        };
        this.transfersService.GetAll(this.selectedAccount.id, request).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.totalSize = result.totalCount;
            this.transfers = result.response;
        });
    }

    add(): void {
        this.dialog.open(TransferAddComponent, {
            width: '500px',
            data: { accountId: this.selectedAccount?.id }
        });
    }

    edit(element: TransferResponse): void {
        this.dialog.open(TransferEditComponent, {
            width: '500px',
            data: { item: element, accountId: this.selectedAccount?.id }
        });
    }

    delete(element: TransferResponse): void {
        if (!this.selectedAccount)
            return;

        this.transfersService.Delete(this.selectedAccount.id, element.id)
            .subscribe(
                (response) => {
                    // TODO: add toastr
                    alert('Accepted');
                }
            );
    }

    paginate(paginate: PageEvent) {
        this.pageNumber = paginate.pageIndex;
        this.pageSize = paginate.pageSize;

        this.loadTransfers();
    }

    sort(sort: Sort) {
        this.sortField = sort.active;
        this.sortOrder = sort.direction == "asc" ? SortOrder.Asc : SortOrder.Desc;

        this.loadTransfers();
    }
}
