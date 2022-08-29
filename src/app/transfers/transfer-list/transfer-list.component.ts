import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TransferResponse } from 'src/app/api/models/Transfers/transfer-response';
import { TransfersService } from 'src/app/api/services/transfers.service';
import { TransferAddComponent } from '../transfer-add/transfer-add.component';
import { TransferEditComponent } from '../transfer-edit/transfer-edit.component';
import { GetTransfersRequest } from 'src/app/api/models/Transfers/get-transfers-request';
import { Sort } from '@angular/material/sort';
import { SortOrder } from 'src/app/api/models/Shared/Search/Sorting/sort-order';
import { PageEvent } from '@angular/material/paginator';

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

    sortField = "dateTime";
    sortOrder = SortOrder.Desc;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private dialog: MatDialog, private transfersService: TransfersService) { }

    ngOnInit(): void {
        this.loadTransfers();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadTransfers(): void {
        var request: GetTransfersRequest = {
            pagination: {
                pageSize: this.pageSize,
                pageNumber: this.pageNumber + 1
            },
            sorting: {
                field: this.sortField,
                order: this.sortOrder
            }
        };
        this.transfersService.GetAll(request).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.totalSize = result.totalCount;
            this.transfers = result.response;
        });
    }

    add(): void {
        this.dialog.open(TransferAddComponent, {
            width: '500px'
        });
    }

    edit(element: TransferResponse): void {
        this.dialog.open(TransferEditComponent, {
            width: '500px',
            data: { item: element }
        });
    }

    paginate(paginate: PageEvent) {
        this.pageNumber = paginate.pageIndex;
        this.pageSize = paginate.pageSize;

        this.loadTransfers();
    }

    sort(sort: Sort) {
        console.log(sort);
       this.sortField = sort.active;
       this.sortOrder = sort.direction == "asc" ? SortOrder.Asc : SortOrder.Desc;

       this.loadTransfers();
    }
}
