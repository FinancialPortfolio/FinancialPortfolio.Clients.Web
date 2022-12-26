import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AssetResponse } from 'src/app/api/models/Categories/asset-response';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { AssetEditComponent } from '../../action-components/asset-edit/asset-edit.component';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

@Component({
    selector: 'app-category-asset-item',
    templateUrl: './category-asset-item.component.html',
    styleUrls: ['./category-asset-item.component.scss']
})
export class CategoryAssetItemComponent implements OnInit {
    @Input()
    set categoryItem(category: CategoryResponse) {
        this.category = category;

        this.assetsDataSource.data = this.category.assets;

        let isUncategorizedCategory = this.categoryOrchestratorService.isUncategorized(this.category);

        this.assetsDisplayedColumns = ['symbol', 'name', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
        if (isUncategorizedCategory) {
            this.assetsDisplayedColumns.splice(this.assetsDisplayedColumns.indexOf('expectedAllocationInPercentage'), 1);
        }
    }

    category!: CategoryResponse;

    assetsDataSource = new MatTableDataSource<AssetResponse>();

    // TODO: change it
    assetsDisplayedColumns: string[] = ['symbol', 'name', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
    comparissonDisplayedColumns: string[] = ['symbol', 'marketCapitalization', 'priceToEarningsValue', 'priceToSalesValue', 'priceToBookValue', 'dividendYield', 'beta'];

    constructor(private dialog: MatDialog, private categoryOrchestratorService: CategoryOrchestratorService) {
        this.categoryOrchestratorService.assetDeleted.subscribe(() => {
            this.assetsDataSource.data = this.category.assets;
        });
     }

    ngOnInit(): void {
    }

    sortAssets(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        this.assetsDataSource.data = this.sortData(this.assetsDataSource.data, sort);
    }

    sortData(array: any[], sort: Sort): any[] {
        return array.sort((a, b) => {
            const aValue = (a as any)[sort.active];
            const bValue = (b as any)[sort.active];
            return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
    }

    editAsset(asset: AssetResponse): void {
        this.dialog.open(AssetEditComponent, {
            width: '500px',
            data: { category: this.category, asset: asset }
        });
    }

    deleteAsset(asset: AssetResponse): void {
        this.categoryOrchestratorService.deleteAsset(this.category, asset);
    }
}
