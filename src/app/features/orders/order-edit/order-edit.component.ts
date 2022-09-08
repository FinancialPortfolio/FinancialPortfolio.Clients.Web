import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, Inject } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from "rxjs/operators";

import { OrderResponse } from "src/app/api/models/Orders/order-response";
import { GetStocksRequest } from "src/app/api/models/Stocks/get-stocks-request";
import { StockResponse } from "src/app/api/models/Stocks/stock-response";
import { OrdersService } from "src/app/api/services/orders.service";
import { StocksService } from "src/app/api/services/stockss.service";
import { AccountEditComponent } from "src/app/features/accounts/account-edit/account-edit.component";

@Component({
    selector: 'app-order-edit',
    templateUrl: './order-edit.component.html',
    styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {
    orderForm!: UntypedFormGroup;

    isLoading = false;
    minLengthTerm = 3;
    debounceTime = 500;
    assets: StockResponse[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private ordersService: OrdersService,
        private stocksService: StocksService,
        private dialogRef: MatDialogRef<AccountEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { item: OrderResponse, accountId: string }) { }

    ngOnInit(): void {
        this.orderForm = this.formBuilder.group({
            type: [0, [Validators.required]],
            amount: [0, [Validators.required]],
            price: [0, [Validators.required]],
            dateTime: [this.ToIsoDate(new Date()), [Validators.required]],
            commission: [0, [Validators.required]],
            asset: ['', [Validators.required]],
            assetId: ['', [Validators.required]]
        });

        this.orderForm.patchValue({
            ...this.data.item,
            asset: this.data.item.stock.name,
            assetId: this.data.item.stock.id,
            dateTime: this.ToIsoDate(this.data.item.dateTime)
        });

        this.initAutocomplete();
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
                        pagination: null,
                        sorting: null
                    };
                    return this.stocksService.GetAll(request)
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

        this.ordersService.Update(this.data.accountId, this.data.item.id, this.orderForm.value)
            .subscribe(
                (response) => {
                    // TODO: add toastr
                    this.dialogRef.close();
                }, (response: HttpErrorResponse) => {
                    this.dialogRef.close();
                },
            );
    }

    private ToIsoDate(date: Date): string {
        return new Date(date).toISOString().slice(0, 16);
    }

    clearSelection() {
        this.orderForm.get('asset')?.setValue("");
        this.orderForm.get('assetId')?.setValue("");
        this.assets = [];
    }

    onSelected(asset: StockResponse) {
        this.orderForm.get('asset')?.setValue(asset.name);
        this.orderForm.get('assetId')?.setValue(asset.id);
    }
}
