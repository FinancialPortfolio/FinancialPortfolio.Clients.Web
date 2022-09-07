import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { OrderResponse } from 'src/app/api/models/Orders/order-response';
import { OrdersService } from 'src/app/api/services/orders.service';
import { OrderAddComponent } from '../order-add/order-add.component';
import { OrderEditComponent } from '../order-edit/order-edit.component';
import { GetOrdersRequest } from 'src/app/api/models/Orders/get-orders-request';
import { SortOrder } from 'src/app/api/models/Shared/Search/Sorting/sort-order';
import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { AppState } from 'src/app/store/app.reducers';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
    orders: OrderResponse[] = [];
    displayedColumns: string[] = ['type', 'amount', 'price', 'dateTime', 'commission', 'actions'];
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
        private ordersService: OrdersService) { }

    ngOnInit(): void {
        this.store.pipe(takeUntil(this.unsubscribe)).subscribe(
            (state: AppState) => {
                this.selectedAccount = state.accounts.selectedAccount;

                this.loadOrders();
            }
        );
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadOrders(): void {
        if (!this.selectedAccount)
            return;

        let request: GetOrdersRequest = {
            pagination: {
                pageSize: this.pageSize,
                pageNumber: this.pageNumber + 1
            },
            sorting: {
                field: this.sortField,
                order: this.sortOrder
            }
        };
        this.ordersService.GetAll(this.selectedAccount.id, request).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.totalSize = result.totalCount;
            this.orders = result.response;
        });
    }

    add(): void {
        this.dialog.open(OrderAddComponent, {
            width: '500px',
            data: { accountId: this.selectedAccount?.id }
        });
    }

    edit(element: OrderResponse): void {
        this.dialog.open(OrderEditComponent, {
            width: '500px',
            data: { item: element, accountId: this.selectedAccount?.id }
        });
    }

    delete(element: OrderResponse): void {
        if (!this.selectedAccount)
            return;

        this.ordersService.Delete(this.selectedAccount.id, element.id)
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

        this.loadOrders();
    }

    sort(sort: Sort) {
        this.sortField = sort.active;
        this.sortOrder = sort.direction == "asc" ? SortOrder.Asc : SortOrder.Desc;

        this.loadOrders();
    }
}
