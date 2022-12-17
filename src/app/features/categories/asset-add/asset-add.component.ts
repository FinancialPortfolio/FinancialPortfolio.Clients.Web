import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { GetAssetsRequest } from 'src/app/api/models/Assets/get-assets-request';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { AssetResponse } from 'src/app/api/models/Assets/asset-response';
import { AssetsService } from 'src/app/api/services/assets.service';

@Component({
  selector: 'app-asset-add',
  templateUrl: './asset-add.component.html',
  styleUrls: ['./asset-add.component.scss']
})
export class AssetAddComponent implements OnInit {
    assetForm!: UntypedFormGroup;
    category: CategoryResponse;

    isLoading = false;
    minLengthTerm = 3;
    debounceTime = 500;
    assets: AssetResponse[] = [];
    asset: AssetResponse | undefined;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dialogRef: MatDialogRef<CategoryAddComponent>,
        private assetsService: AssetsService,
        @Inject(MAT_DIALOG_DATA) public data: { item: CategoryResponse }) {
        this.category = data.item;
    }

    ngOnInit(): void {
        this.assetForm = this.formBuilder.group({
            allocation: [3, [Validators.required, Validators.maxLength(50)]],
            asset: ['', [Validators.required]],
            assetId: ['', [Validators.required]]
        });

        this.initAutocomplete();
    }

    initAutocomplete(): void {
        this.assetForm.get('asset')?.valueChanges
            .pipe(
                filter(result => {
                    return result !== null && result.length >= this.minLengthTerm
                }),
                distinctUntilChanged(),
                debounceTime(this.debounceTime),
                tap(() => {
                    this.assets = [];
                    this.isLoading = true;
                }),
                switchMap(value => {
                    let request: GetAssetsRequest = {
                        name: value,
                        symbol: null,
                        type: null,
                        pagination: null,
                        sorting: null
                    };
                    return this.assetsService.getAll(request)
                        .pipe(finalize(() => this.isLoading = false));
                })
            )
            .subscribe((result: any) => {
                this.assets = result.response;
            });
    }

    onSave(): void {
        if (!this.assetForm.valid || !this.asset)
            return;

        // this.category.assets.push({
        //     allocation: this.assetForm.get('allocation')?.value,
        //     expectedAllocationInPercentage: this.assetForm.get('allocation')?.value,
        //     name: this.asset.name,
        //     symbol: this.asset.symbol
        // });

        this.dialogRef.close();
    }

    clearSelection() {
        this.assetForm.get('asset')?.setValue("");
        this.assetForm.get('assetId')?.setValue("");
        this.assets = [];
    }

    onSelected(asset: AssetResponse) {
        this.asset = asset;
        this.assetForm.get('asset')?.setValue(asset.name);
        this.assetForm.get('assetId')?.setValue(asset.id);
    }
}
