import { Component, OnInit, Inject } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import { TransferResponse } from "src/app/api/models/TransferApi/transfer-response";

@Component({
    selector: 'app-transfer-edit',
    templateUrl: './transfer-edit.component.html',
    styleUrls: ['./transfer-edit.component.scss']
})
export class TransferEditComponent implements OnInit {
    transferForm!: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { item: TransferResponse }) { }

    ngOnInit(): void {
        this.transferForm = this.formBuilder.group({
            amount: [0, [Validators.required]],
            type: [0, [Validators.required]]
        });

        this.transferForm.patchValue(this.data.item);
    }

    onSave(): void {
        if (!this.transferForm.valid)
            return;

        alert("Add after implementing on back end");
    }
}
