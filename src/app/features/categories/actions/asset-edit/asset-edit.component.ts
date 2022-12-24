import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { AssetResponse as CategoryAssetResponse } from 'src/app/api/models/Categories/asset-response';

@Component({
    selector: 'app-asset-edit',
    templateUrl: './asset-edit.component.html',
    styleUrls: ['./asset-edit.component.scss']
})
export class AssetEditComponent implements OnInit {
    assetForm!: UntypedFormGroup;
    category: CategoryResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dialogRef: MatDialogRef<AssetEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { category: CategoryResponse, asset: CategoryAssetResponse }) {
        this.category = data.category;
    }

    ngOnInit(): void {
        this.assetForm = this.formBuilder.group({
            expectedAllocationInPercentage: [3, [Validators.required, Validators.maxLength(50)]]
        });

        this.assetForm.patchValue(this.data.asset);
    }

    onSave(): void {
        if (!this.assetForm.valid)
            return;

        // this.categoryAllocationService.updateAsset(asset);

        this.dialogRef.close();
    }
}
