import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Subject } from 'rxjs';

import { StockAsset } from 'src/app/api/models/Assets/asset-type';
import { AssetResponse } from 'src/app/api/models/Categories/asset-response';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { sortArray } from 'src/app/shared/helpers/sorting.helper';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

@Component({
    selector: 'app-asset-comparison',
    templateUrl: './asset-comparison.component.html',
    styleUrls: ['./asset-comparison.component.scss']
})
export class AssetComparisonComponent implements OnInit, OnDestroy {
    @Input()
    category!: CategoryResponse;

    assets: AssetResponse[] = [];
    empty = false;

    assetsDisplayedColumns: string[] = ['symbol', 'name', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'assetStatistics.marketCapitalization',
    'assetStatistics.priceToEarningsValue', 'assetStatistics.priceToSalesValue', 'assetStatistics.priceToBookValue', 'assetStatistics.dividendYield', 'assetStatistics.beta'];

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private categoryOrchestratorService: CategoryOrchestratorService) {
    }

    hasCategories(): boolean {
        return this.categoryOrchestratorService.hasCategories(this.category);
    }

    hasAssets(): boolean {
        return this.categoryOrchestratorService.hasAssets(this.category);
    }

    ngOnInit(): void {
        this.assets = this.getAssets(this.category);

        this.empty = this.isEmpty();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    sortAssets(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        this.assets = sortArray(this.assets.slice(), sort.active, sort.direction === "asc");
    }

    selectCategory() {
        this.categoryOrchestratorService.selectedCategory.next(this.category);
        this.categoryOrchestratorService.showComparision = false;
    }

    isEmpty(): boolean {
        if (this.assets?.length > 0)
            return false;

        let treeLevel = this.categoryOrchestratorService.getTreeLevel(this.category);
        if (treeLevel > 3 && this.categoryOrchestratorService.globalCategory == this.category)
            return true;

        for (let subCategory of this.category.subCategories) {
            if (subCategory.isSelected && this.getAssets(subCategory)?.length > 0)
                return false;
        }

        return true;
    }

    getAssets(category: CategoryResponse): AssetResponse[] {
        return category.assets?.filter(asset =>
            asset.type == StockAsset && (asset.allocation || asset.expectedAllocationInPercentage)) ?? [];
    }
}
