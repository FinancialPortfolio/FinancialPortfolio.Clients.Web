import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, Inject } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AccountEditComponent } from "src/app/features/accounts/account-edit/account-edit.component";

import { TransferResponse } from "src/app/api/models/Transfers/transfer-response";
import { TransfersService } from "src/app/api/services/transfers.service";

@Component({
    selector: 'app-transfer-edit',
    templateUrl: './transfer-edit.component.html',
    styleUrls: ['./transfer-edit.component.scss']
})
export class TransferEditComponent implements OnInit {
    transferForm!: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private transfersService: TransfersService,
        private dialogRef: MatDialogRef<AccountEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { item: TransferResponse, accountId: string }) { }

    ngOnInit(): void {
        this.transferForm = this.formBuilder.group({
            amount: [0, [Validators.required]],
            type: [0, [Validators.required]],
            dateTime: [this.ToIsoDate(new Date()), [Validators.required]]
        });

        this.transferForm.patchValue({
            ...this.data.item,
            dateTime: this.ToIsoDate(this.data.item.dateTime)
        });
    }

    onSave(): void {
        if (!this.transferForm.valid)
            return;

        this.transfersService.Update(this.data.accountId, this.data.item.id, this.transferForm.value)
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
