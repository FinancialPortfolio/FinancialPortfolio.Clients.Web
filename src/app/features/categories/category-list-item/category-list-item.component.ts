import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LegendPosition } from '@swimlane/ngx-charts';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { AssetResponse } from 'src/app/api/models/Categories/asset-response';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { AssetAddComponent } from '../asset-add/asset-add.component';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-category-list-item',
    templateUrl: './category-list-item.component.html',
    styleUrls: ['./category-list-item.component.scss']
})
export class CategoryListItemComponent {
    @Output()
    select = new EventEmitter<CategoryResponse>();

    category!: CategoryResponse;
    @Input() set categoryItem(value: CategoryResponse) {
        this.category = value;

        this.category.assets = value.assets?.sort((a, b) => b.allocation - a.allocation);
        this.category.subCategories = value.subCategories?.sort((a, b) => b.allocation - a.allocation);


        if (this.category.subCategories.length > 0) {
            this.allocationsChart = this.category.subCategories.map(category => ({ name: category.name, value: category.allocationInPercentage }));
            this.expectedAllocationsChart = this.category.subCategories.map(category => ({ name: category.name, value: category.expectedAllocationInPercentage }));
        } else if (this.category.assets.length > 0) {
            this.allocationsChart = this.category.assets.map(asset => ({ name: asset.name, value: asset.allocationInPercentage }));
            this.expectedAllocationsChart = this.category.assets.map(asset => ({ name: asset.name, value: asset.expectedAllocationInPercentage }));
        }
    }

    categoriesDisplayedColumns: string[] = ['name', 'description', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
    assetsDisplayedColumns: string[] = ['symbol', 'name', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
    comparissonDisplayedColumns: string[] = ['symbol', 'marketCapitalization', 'priceToEarningsValue', 'priceToSalesValue', 'priceToBookValue', 'dividendYield', 'beta']

    allocationsChart: {name: string, value: number}[] = [];
    expectedAllocationsChart: {name: string, value: number}[] = [];

    pieOptions = {
        gradient: true,
        showLegend: false,
        showLabels: true,
        isDoughnut: false,
        legendPosition: LegendPosition.Below,
        colorScheme: "nightLights"
    };

    constructor(private dialog: MatDialog) { }

    addCategory(): void {
        this.dialog.open(CategoryAddComponent, {
            width: '500px',
            data: { item: this.category }
        });
    }

    addAsset(): void {
        this.dialog.open(AssetAddComponent, {
            width: '500px',
            data: { item: this.category }
        });
    }

    hasCategories(): boolean {
        return this.category.subCategories != null && this.category.subCategories.length > 0;
    }

    hasAssets(): boolean {
        return this.category.assets != null && this.category.assets.length > 0;
    }

    editCurrentCategory(): void {
        alert('edit shold be here');
    }

    editSubCategory(category: CategoryResponse): void {
        alert('edit shold be here');
    }

    deleteSubCategory(category: CategoryResponse): void {
        alert('delete shold be here');
    }

    editAsset(asset: AssetResponse): void {
        alert('edit shold be here');
    }

    deleteAsset(asset: AssetResponse): void {
        alert('delete shold be here');
    }

    onSelect(data: any): void {
        if (this.category.subCategories.length == 0)
            return;

        let selectedCategory = this.category.subCategories.find(c => c.name == data.name);
        this.select.emit(selectedCategory);
    }

    sortAssets(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        this.category.assets = this.sortData(this.category.assets, sort);
    }

    sortSubCategories(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        this.category.subCategories = this.sortData(this.category.subCategories, sort);
    }

    sortData(array: any[], sort: Sort): any[] {
        return array.slice().sort((a, b) => {
            const aValue = (a as any)[sort.active];
            const bValue = (b as any)[sort.active];
            return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
    }
}
