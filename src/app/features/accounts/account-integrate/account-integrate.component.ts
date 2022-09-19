import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { IntegrateRequest } from 'src/app/api/models/Integration/integrate-request';
import { IntegrationSource } from 'src/app/api/models/Integration/integration-source';
import { IntegrationService } from 'src/app/api/services/integration.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AccountEditComponent } from '../account-edit/account-edit.component';

@Component({
    selector: 'app-account-integrate',
    templateUrl: './account-integrate.component.html',
    styleUrls: ['./account-integrate.component.scss']
})
export class AccountIntegrateComponent implements OnInit {
    integrationForm!: UntypedFormGroup;
    file: File | undefined;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private integrationService: IntegrationService,
        private notificationService: NotificationService,
        private dialogRef: MatDialogRef<AccountEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { item: AccountResponse }) {
    }

    ngOnInit(): void {
        this.integrationForm = this.formBuilder.group({
            source: [IntegrationSource.InteractiveBrokers, [Validators.required]],
            file: ['', [Validators.required]]
        });
    }

    onFileChange($event: any) {
        this.file = $event.target.files[0];
    }

    onSave(): void {
        if (!this.integrationForm.valid)
            return;

        let integrateRequest: IntegrateRequest = {
            ...this.integrationForm.value,
            file: this.file
        };

        this.integrationService.integrate(this.data.item.id, integrateRequest)
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
