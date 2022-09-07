import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, Inject } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AccountEditComponent } from "src/app/accounts/account-edit/account-edit.component";

import { OrderResponse } from "src/app/api/models/Orders/order-response";
import { OrdersService } from "src/app/api/services/orders.service";

@Component({
    selector: 'app-order-edit',
    templateUrl: './order-edit.component.html',
    styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {
    orderForm!: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private ordersService: OrdersService,
        private dialogRef: MatDialogRef<AccountEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { item: OrderResponse, accountId: string }) { }

    ngOnInit(): void {
        this.orderForm = this.formBuilder.group({
            type: [0, [Validators.required]],
            amount: [0, [Validators.required]],
            price: [0, [Validators.required]],
            dateTime: [this.ToIsoDate(new Date()), [Validators.required]],
            commission: [0, [Validators.required]],
            assetId: [0, [Validators.required]]
        });

        this.orderForm.patchValue({
            ...this.data.item,
            dateTime: this.ToIsoDate(this.data.item.dateTime)
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
}
