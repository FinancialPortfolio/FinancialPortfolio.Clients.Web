import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import { selectSelectedAccount } from 'src/app/features/accounts/store/accounts.selectors';
import { CreateOrderRequest } from 'src/app/api/models/Orders/create-order-request';
import { OrdersService } from 'src/app/api/services/orders.service';
import { AppState } from 'src/app/store/app.reducers';
import { OrderType } from 'src/app/api/models/Orders/order-type';
import { StocksService } from 'src/app/api/services/stocks.service';
import { GetStocksRequest } from 'src/app/api/models/Stocks/get-stocks-request';
import { StockResponse } from 'src/app/api/models/Stocks/stock-response';
import { DateService } from 'src/app/core/services/date.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FetchStockStatisticsRequest } from 'src/app/api/models/Stocks/fetch-stock-statistics-request';
import { SignalrService } from 'src/app/core/services/signalr.service';
import { SuccessfulOperation } from 'src/app/core/models/successful-operation';
import { StocksUpdatedOperation } from 'src/app/core/models/operations';

@Component({
    selector: 'app-order-add',
    templateUrl: './order-add.component.html',
    styleUrls: ['./order-add.component.scss']
})
export class OrderAddComponent implements OnInit, OnDestroy {
    orderForm!: UntypedFormGroup;
    accountId: string | undefined | null;

    isLoading = false;
    minLengthTerm = 3;
    debounceTime = 500;
    assets: StockResponse[] = [];

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private ordersService: OrdersService,
        private stocksService: StocksService,
        private signalrService: SignalrService,
        private dateService: DateService,
        private notificationService: NotificationService,
        private dialogRef: MatDialogRef<OrderAddComponent>,
        private store: Store<AppState>,
        @Inject(MAT_DIALOG_DATA) public data: { accountId: string }) { }

    ngOnInit(): void {
        this.orderForm = this.formBuilder.group({
            type: [OrderType.Buy, [Validators.required]],
            amount: [1, [Validators.required]],
            price: [1, [Validators.required]],
            dateTime: [this.dateService.toIsoDate(new Date()), [Validators.required]],
            commission: [0, [Validators.required]],
            asset: ['', [Validators.required]],
            assetId: ['', [Validators.required]]
        });

        this.store.select(selectSelectedAccount).pipe(takeUntil(this.unsubscribe)).subscribe(
            (selectedAccount) => {
                this.accountId = selectedAccount?.id;
            }
        );

        this.signalrService.operationSucceededSubject.subscribe((data: SuccessfulOperation) => {
            if (data.name != StocksUpdatedOperation)
                return;

            let stockId = this.orderForm.get('assetId')?.value;
            let stock = data.payload.stocks.find((s: StockResponse) => s.id == stockId);
            if (stock)
                this.orderForm.get('price')?.setValue(stock.stockStatistics.currentPrice);
        });

        this.initAutocomplete();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    initAutocomplete(): void {
        this.orderForm.get('asset')?.valueChanges
            .pipe(
                filter(result => {
                    return result !== null && result.length >= this.minLengthTerm
                }),
                distinctUntilChanged(),
                debounceTime(this.debounceTime),
                tap(() => {
                    this.assets = [];
                    this.isLoading = true;
                }),
                switchMap(value => {
                    let request: GetStocksRequest = {
                        name: value,
                        symbol: null,
                        type: null,
                        pagination: null,
                        sorting: null
                    };
                    return this.stocksService.getAll(request)
                        .pipe(finalize(() => this.isLoading = false));
                })
            )
            .subscribe((result: any) => {
                this.assets = result.response;
            });
    }

    onSave(): void {
        if (!this.orderForm.valid)
            return;

        let body: CreateOrderRequest = {
            ...this.orderForm.value,
            accountId: this.accountId
        };
        this.ordersService.create(this.data.accountId, body)
            .subscribe(
                () => {
                    this.notificationService.success('Accepted');
                    this.dialogRef.close();
                }, () => {
                    this.dialogRef.close();
                },
            );
    }

    clearSelection() {
        this.orderForm.get('asset')?.setValue("");
        this.orderForm.get('assetId')?.setValue("");
        this.assets = [];
    }

    onSelected(asset: StockResponse) {
        this.fetchStockPrice(asset.symbol);

        this.orderForm.get('asset')?.setValue(asset.name);
        this.orderForm.get('assetId')?.setValue(asset.id);
    }

    fetchStockPrice(symbol: string): void {
        let request: FetchStockStatisticsRequest = {
            symbols: [ symbol ]
        };

        this.stocksService.fetchStockStatistics(request).subscribe(() => {});
    }
}
