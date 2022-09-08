import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { AccountsService } from 'src/app/api/services/accounts.service';

@Component({
    selector: 'app-account-edit',
    templateUrl: './account-edit.component.html',
    styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {
    accountForm!: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private accountsService: AccountsService,
        private dialogRef: MatDialogRef<AccountEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { item: AccountResponse }) {
    }

    ngOnInit(): void {
        this.accountForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(25)]],
            description: ['', [Validators.required, Validators.maxLength(50)]]
        });

        this.accountForm.patchValue(this.data.item);
    }

    onSave(): void {
        if (!this.accountForm.valid)
            return;

        this.accountsService.Update(this.data.item.id, this.accountForm.value)
            .subscribe(
                (response) => {
                    // TODO: add toastr
                    this.dialogRef.close();
                }, (response: HttpErrorResponse) => {
                    this.dialogRef.close();
                },
            );
    }
}
