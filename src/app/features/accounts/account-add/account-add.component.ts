import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountsService } from 'src/app/api/services/accounts.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
    selector: 'app-account-add',
    templateUrl: './account-add.component.html',
    styleUrls: ['./account-add.component.scss']
})
export class AccountAddComponent implements OnInit {
    accountForm!: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private accountsService: AccountsService,
        private notificationService: NotificationService,
        private dialogRef: MatDialogRef<AccountAddComponent>) { }

    ngOnInit(): void {
        this.accountForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(25)]],
            description: ['', [Validators.required, Validators.maxLength(50)]]
        });
    }

    onSave(): void {
        if (!this.accountForm.valid)
            return;

        this.accountsService.Create(this.accountForm.value)
            .subscribe(
                () => {
                    this.notificationService.success('Accepted');
                    this.dialogRef.close();
                }, () => {
                    this.dialogRef.close();
                },
            );
    }
}
