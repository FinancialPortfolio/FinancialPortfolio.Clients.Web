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

    assetsDisplayedColumns: string[] = ['symbol', 'name', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'marketCapitalization', 'priceToEarningsValue', 'priceToSalesValue', 'priceToBookValue', 'dividendYield', 'beta'];
    // ADD average price, number of shares

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private categoryOrchestratorService: CategoryOrchestratorService) {
        if (!this.category && this.categoryOrchestratorService.globalCategory)
            this.category = this.categoryOrchestratorService.globalCategory;
    }

    ngOnInit(): void {
        this.assets = this.category.assets?.filter(asset =>
            asset.type == StockAsset && (asset.allocation || asset.expectedAllocationInPercentage)) ?? [];
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    sortAssets(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        this.assets = sortArray(this.assets, sort.active, sort.direction === "asc");
    }
}
