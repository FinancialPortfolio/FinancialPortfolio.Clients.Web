import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LegendPosition } from '@swimlane/ngx-charts';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { AssetResponse } from 'src/app/api/models/Categories/asset-response';
import { SubCategoryAddComponent } from '../actions/sub-category-add/sub-category-add.component';
import { AssetAddComponent } from '../actions/asset-add/asset-add.component';
import { Sort } from '@angular/material/sort';
import { CategoryAllocationService } from '../services/category-allocation.service';
import { MatTableDataSource } from '@angular/material/table';
import { AssetEditComponent } from '../actions/asset-edit/asset-edit.component';
import { SubCategoryEditComponent } from '../actions/sub-category-edit/sub-category-edit.component';

@Component({
    selector: 'app-category-list-item',
    templateUrl: './category-list-item.component.html',
    styleUrls: ['./category-list-item.component.scss']
})
export class CategoryListItemComponent {
    category!: CategoryResponse;

    assetsDataSource = new MatTableDataSource<AssetResponse>();
    subCategoriesDataSource = new MatTableDataSource<CategoryResponse>();

    // TODO: change it
    categoriesDisplayedColumns: string[] = ['name', 'description', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
    assetsDisplayedColumns: string[] = ['symbol', 'name', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
    comparissonDisplayedColumns: string[] = ['symbol', 'marketCapitalization', 'priceToEarningsValue', 'priceToSalesValue', 'priceToBookValue', 'dividendYield', 'beta']

    allocationsChart: {name: string, value: number}[] = [];
    expectedAllocationsChart: {name: string, value: number}[] = [];

    isUncategorizedCategory = false;

    pieOptions = {
        gradient: true,
        showLegend: false,
        showLabels: true,
        isDoughnut: false,
        legendPosition: LegendPosition.Below,
        colorScheme: "nightLights"
    };

    constructor(private dialog: MatDialog, private categoryAllocationService: CategoryAllocationService) {
        this.categoryAllocationService.selectedCategory.subscribe(selectedCategory => { // TODO: add unsubscribe
            if (!selectedCategory)
                return;

            this.category = selectedCategory;

            this.calculatePies();

            this.assetsDataSource.data = this.category.assets;
            this.subCategoriesDataSource.data = this.category.subCategories;
        });
    }

    calculatePies(): void {
        this.category.assets?.sort((a, b) => b.allocation - a.allocation);
        this.category.subCategories?.sort((a, b) => b.allocation - a.allocation);

        if (this.hasCategories()) {
            this.allocationsChart = this.category.subCategories.map(category => ({ name: category.name, value: category.allocationInPercentage }));
            this.expectedAllocationsChart = this.category.subCategories.map(category => ({ name: category.name, value: category.expectedAllocationInPercentage }));
        } else if (this.hasAssets()) {
            this.allocationsChart = this.category.assets.map(asset => ({ name: asset.name, value: asset.allocationInPercentage }));
            this.expectedAllocationsChart = this.category.assets.map(asset => ({ name: asset.name, value: asset.expectedAllocationInPercentage }));
        }

        this.isUncategorizedCategory = this.categoryAllocationService.isUncategorized(this.category);

        this.categoriesDisplayedColumns = ['name', 'description', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
        this.assetsDisplayedColumns = ['symbol', 'name', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
        this.comparissonDisplayedColumns = ['symbol', 'marketCapitalization', 'priceToEarningsValue', 'priceToSalesValue', 'priceToBookValue', 'dividendYield', 'beta'];

        if (this.isUncategorizedCategory) {
            this.categoriesDisplayedColumns.splice(this.categoriesDisplayedColumns.indexOf('expectedAllocationInPercentage'), 1);
            this.assetsDisplayedColumns.splice(this.assetsDisplayedColumns.indexOf('expectedAllocationInPercentage'), 1);
        }
    }

    hasCategories(): boolean {
        return this.category.subCategories != null && this.category.subCategories.length > 0;
    }

    hasAssets(): boolean {
        return this.category.assets != null && this.category.assets.length > 0;
    }

    addCategory(): void {
        this.dialog.open(SubCategoryAddComponent, {
            width: '500px',
            data: { category: this.category }
        });
    }

    editCurrentCategory(): void {
        this.dialog.open(SubCategoryEditComponent, {
            width: '500px',
            data: { category: this.category, subCategoy: this.category }
        });
    }

    editSubCategory(subCategory: CategoryResponse): void {
        this.dialog.open(SubCategoryEditComponent, {
            width: '500px',
            data: { category: this.category, subCategory }
        });
    }

    deleteSubCategory(subCategory: CategoryResponse): void {
        let subCategoryIndex = this.category.subCategories?.findIndex(a => a == subCategory);
        if (subCategoryIndex)
            this.category.subCategories.splice(subCategoryIndex, 1);
    }

    addAsset(): void {
        this.dialog.open(AssetAddComponent, {
            width: '500px',
            data: { category: this.category }
        });
    }

    editAsset(asset: AssetResponse): void {
        this.dialog.open(AssetEditComponent, {
            width: '500px',
            data: { category: this.category, asset: asset }
        });
    }

    deleteAsset(asset: AssetResponse): void {
        this.categoryAllocationService.deleteAsset(this.category, asset);
    }

    onSelect(data: any): void {
        if (this.category.subCategories.length == 0)
            return;

        let selectedCategory = this.category.subCategories.find(c => c.name == data.name) ?? null;
        this.categoryAllocationService.selectedCategory.next(selectedCategory);
    }

    sortAssets(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        this.assetsDataSource.data = this.sortData(this.assetsDataSource.data, sort);
    }

    sortSubCategories(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        this.subCategoriesDataSource.data = this.sortData(this.subCategoriesDataSource.data, sort);
    }

    sortData(array: any[], sort: Sort): any[] {
        return array.sort((a, b) => {
            const aValue = (a as any)[sort.active];
            const bValue = (b as any)[sort.active];
            return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
    }
}
