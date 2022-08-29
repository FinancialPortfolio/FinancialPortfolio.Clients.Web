import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { selectSelectedAccount } from 'src/app/accounts/store/accounts.selectors';
import { BaseWebApiResponse } from 'src/app/api/models/Shared/base-web-api-response';
import { WebApiProblemDetails } from 'src/app/api/models/Shared/web-api-problem-details';
import { CreateTransferRequest } from 'src/app/api/models/Transfers/create-transfer-request';
import { TransfersService } from 'src/app/api/services/transfers.service';
import { AppState } from 'src/app/store/app.reducers';

@Component({
    selector: 'app-transfer-add',
    templateUrl: './transfer-add.component.html',
    styleUrls: ['./transfer-add.component.scss']
})
export class TransferAddComponent implements OnInit, OnDestroy {
    transferForm!: UntypedFormGroup;
    accountId: string | undefined | null;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private transfersService: TransfersService,
        private dialogRef: MatDialogRef<TransferAddComponent>,
        private store: Store<AppState>,
        @Inject(MAT_DIALOG_DATA) public data: { accountId: string }) { }

    ngOnInit(): void {
        this.transferForm = this.formBuilder.group({
            amount: [0, [Validators.required]],
            type: ['Deposit', [Validators.required]]
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
        if (!this.transferForm.valid)
            return;

        let body: CreateTransferRequest = {
            ...this.transferForm.value,
            accountId: this.accountId
        };
        this.transfersService.Create(this.data.accountId, body)
            .subscribe(
                (result: BaseWebApiResponse) => {
                    // TODO: add toastr
                    this.dialogRef.close();
                }, (error: WebApiProblemDetails) => {
                    this.dialogRef.close();
                },
            );
    }
}
