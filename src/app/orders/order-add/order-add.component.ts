import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { selectSelectedAccount } from 'src/app/accounts/store/accounts.selectors';
import { BaseWebApiResponse } from 'src/app/api/models/Shared/base-web-api-response';
import { WebApiProblemDetails } from 'src/app/api/models/Shared/web-api-problem-details';
import { CreateOrderRequest } from 'src/app/api/models/Orders/create-order-request';
import { OrdersService } from 'src/app/api/services/orders.service';
import { AppState } from 'src/app/store/app.reducers';
import { OrderType } from 'src/app/api/models/Orders/order-type';

@Component({
    selector: 'app-order-add',
    templateUrl: './order-add.component.html',
    styleUrls: ['./order-add.component.scss']
})
export class OrderAddComponent implements OnInit, OnDestroy {
    orderForm!: UntypedFormGroup;
    accountId: string | undefined | null;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private ordersService: OrdersService,
        private dialogRef: MatDialogRef<OrderAddComponent>,
        private store: Store<AppState>,
        @Inject(MAT_DIALOG_DATA) public data: { accountId: string }) { }

    ngOnInit(): void {
        this.orderForm = this.formBuilder.group({
            type: [OrderType.Buy, [Validators.required]],
            amount: [1, [Validators.required]],
            price: [1, [Validators.required]],
            dateTime: [this.ToIsoDate(new Date()), [Validators.required]],
            commission: [0, [Validators.required]],
            assetId: ['7cb76312-bc8c-4cf0-8ab0-111befb98c98', [Validators.required]]
        });

        this.store.select(selectSelectedAccount).pipe(takeUntil(this.unsubscribe)).subscribe(
            (selectedAccount) => {
                this.accountId = selectedAccount?.id;
            }
        );
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onSave(): void {
        if (!this.orderForm.valid)
            return;

        let body: CreateOrderRequest = {
            ...this.orderForm.value,
            accountId: this.accountId
        };
        this.ordersService.Create(this.data.accountId, body)
            .subscribe(
                (result: BaseWebApiResponse) => {
                    // TODO: add toastr
                    this.dialogRef.close();
                }, (error: WebApiProblemDetails) => {
                    this.dialogRef.close();
                },
            );
    }

    private ToIsoDate(date: Date): string {
        return new Date(date).toISOString().slice(0, 16);
    }
}
