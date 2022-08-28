import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountsService } from 'src/app/api/services/accounts.service';

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
                (result) => {
                    console.log(result);
                    // TODO: add to store on saved event
                    // TODO: add toastr
                    this.dialogRef.close();
                }, (error) => {
                    console.log(error);
                    // TODO: add toastr
                    this.dialogRef.close();
                },
            );
    }
}
