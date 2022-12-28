import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AssetResponse } from 'src/app/api/models/Categories/asset-response';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { AssetEditComponent } from '../../action-components/asset-edit/asset-edit.component';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';
import { StockAsset } from 'src/app/api/models/Assets/asset-type';
import { sortArray } from 'src/app/shared/helpers/sorting.helper';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
    selector: 'app-category-asset-item',
    templateUrl: './category-asset-item.component.html',
    styleUrls: ['./category-asset-item.component.scss']
})
export class CategoryAssetItemComponent implements OnInit, OnDestroy {
    @Input()
    set categoryItem(category: CategoryResponse) {
        this.category = category;

        this.setAssetsDataSource(this.category.assets);

        let isUncategorizedCategory = this.categoryOrchestratorService.isUncategorized(this.category);

        this.assetsDisplayedColumns = isUncategorizedCategory
            ? ['symbol', 'name', 'allocation', 'allocationInPercentage', 'actions']
            : ['symbol', 'name', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
        this.comparissonDisplayedColumns = ['symbol', 'marketCapitalization', 'priceToEarningsValue', 'priceToSalesValue', 'priceToBookValue', 'dividendYield', 'beta'];
    }

    category!: CategoryResponse;

    assetsDataSource = new MatTableDataSource<AssetResponse>();
    assetComparissonDataSource = new MatTableDataSource<AssetResponse>();

    assetsDisplayedColumns: string[] = [];
    comparissonDisplayedColumns: string[] = [];

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private dialog: MatDialog, private categoryOrchestratorService: CategoryOrchestratorService, private notificationService: NotificationService) {
        this.categoryOrchestratorService.assetDeleted.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setAssetsDataSource(this.category.assets);
        });
        this.categoryOrchestratorService.assetAdded.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setAssetsDataSource(this.category.assets);
        });
    }

    setAssetsDataSource(assets: AssetResponse[]) {
        this.assetsDataSource.data = assets;
        this.assetComparissonDataSource.data = assets.filter(asset => asset.type == StockAsset);
    }

    ngOnInit(): void {
    }


    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    sortAssets(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        let sortedAssets = sortArray(this.assetsDataSource.data, sort.active, sort.direction === "asc");
        this.setAssetsDataSource(sortedAssets);
    }

    editAsset(asset: AssetResponse): void {
        this.dialog.open(AssetEditComponent, {
            width: '500px',
            data: { category: this.category, asset: asset }
        });
    }

    deleteAsset(asset: AssetResponse): void {
        this.notificationService.confirm("Confirm action", "Do you want to delete this asset?").subscribe(result => {
            if (!result)
                return;

            this.categoryOrchestratorService.deleteAsset(this.category, asset);
        });
    }
}
