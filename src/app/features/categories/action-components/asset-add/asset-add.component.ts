import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { GetAssetsRequest } from 'src/app/api/models/Assets/get-assets-request';
import { AssetResponse } from 'src/app/api/models/Assets/asset-response';
import { AssetResponse as CategoryAssetResponse } from 'src/app/api/models/Categories/asset-response';
import { AssetsService } from 'src/app/api/services/assets.service';
import { FetchAssetStatisticsRequest } from 'src/app/api/models/Assets/fetch-asset-statistics-request';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

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
        private dialogRef: MatDialogRef<AssetAddComponent>,
        private assetsService: AssetsService,
        private categoryOrchestratorService: CategoryOrchestratorService,
        @Inject(MAT_DIALOG_DATA) public data: { category: CategoryResponse }) {
        this.category = data.category;
    }

    ngOnInit(): void {
        this.assetForm = this.formBuilder.group({
            expectedAllocationInPercentage: [3, [Validators.required, Validators.maxLength(50)]],
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

        let asset = this.createAsset();

        this.category.assets.push(asset);
        this.categoryOrchestratorService.addAsset(asset);

        this.fetchAssetPrices(this.asset.id);

        this.dialogRef.close();
    }

    createAsset(): CategoryAssetResponse {
        let orders = this.categoryOrchestratorService.getAsset(this.asset!.id)?.orders ?? [];
        let asset: CategoryAssetResponse = {
            name: this.asset!.name,
            symbol: this.asset!.symbol,
            type: this.asset!.type,
            assetId: this.asset!.id,
            expectedAllocationInPercentage: this.assetForm.get('expectedAllocationInPercentage')?.value,
            orders: orders,
            allocation: 0,
            allocationInPercentage: 0,
            assetStatistics: undefined
        };

        return asset;
    }

    fetchAssetPrices(assetId: string) {
        let request: FetchAssetStatisticsRequest = {
            ids: [assetId]
        };
        this.assetsService.fetchAssetStatistics(request).subscribe(() => { });
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
