import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize, takeUntil } from "rxjs/operators";

import { OrderResponse } from "src/app/api/models/Orders/order-response";
import { FetchStockStatisticsRequest } from "src/app/api/models/Stocks/fetch-stock-statistics-request";
import { GetStocksRequest } from "src/app/api/models/Stocks/get-stocks-request";
import { StockResponse } from "src/app/api/models/Stocks/stock-response";
import { OrdersService } from "src/app/api/services/orders.service";
import { StocksService } from "src/app/api/services/stocks.service";
import { StocksUpdatedOperation } from "src/app/core/models/operations";
import { SuccessfulOperation } from "src/app/core/models/successful-operation";
import { DateService } from "src/app/core/services/date.service";
import { NotificationService } from "src/app/core/services/notification.service";
import { SignalrService } from "src/app/core/services/signalr.service";
import { AccountEditComponent } from "src/app/features/accounts/account-edit/account-edit.component";

@Component({
    selector: 'app-order-edit',
    templateUrl: './order-edit.component.html',
    styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit, OnDestroy {
    orderForm!: UntypedFormGroup;

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
        private dialogRef: MatDialogRef<AccountEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { item: OrderResponse, accountId: string }) { }

    ngOnInit(): void {
        this.orderForm = this.formBuilder.group({
            type: [0, [Validators.required]],
            amount: [0, [Validators.required]],
            price: [0, [Validators.required]],
            dateTime: [this.dateService.toIsoDate(new Date()), [Validators.required]],
            commission: [0, [Validators.required]],
            asset: ['', [Validators.required]],
            assetId: ['', [Validators.required]]
        });

        this.orderForm.patchValue({
            ...this.data.item,
            asset: this.data.item.stock.name,
            assetId: this.data.item.stock.id,
            dateTime: this.dateService.toIsoDate(this.data.item.dateTime)
        });

        this.signalrService.operationSucceededSubject.pipe(takeUntil(this.unsubscribe)).subscribe((data: SuccessfulOperation) => {
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

        this.ordersService.update(this.data.accountId, this.data.item.id, this.orderForm.value)
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
