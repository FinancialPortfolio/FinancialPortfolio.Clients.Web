import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AssetResponse as CategoryAssetResponse } from 'src/app/api/models/Categories/asset-response';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryCalculationService } from './category-calculation.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryOrchestratorService extends CategoryCalculationService {
    assetAdded = new Subject<CategoryAssetResponse>();
    assetUpdated = new Subject<CategoryAssetResponse>();
    assetDeleted = new Subject<CategoryAssetResponse>();

    subCategoryAdded = new Subject<CategoryResponse>();
    subCategoryUpdated = new Subject<CategoryResponse>();
    subCategoryDeleted = new Subject<CategoryResponse>();

    comparisonSelectionUpdated = new Subject<void>();

    showComparision = false;

    constructor() {
        super();
    }

    hasCategories(category: CategoryResponse): boolean {
        return category.subCategories != null && category.subCategories.length > 0;
    }

    hasAssets(category: CategoryResponse): boolean {
        return category.assets != null && category.assets.length > 0;
    }

    addAsset(asset: CategoryAssetResponse): void {
        this.hasChanges = true;

        this.removeUncategorizedAsset(asset);

        this.assetAdded.next(asset);
    }

    updateAsset(asset: CategoryAssetResponse): void {
        this.hasChanges = true;

        this.assetUpdated.next(asset);
    }

    deleteAsset(category: CategoryResponse, asset: CategoryAssetResponse): void {
        let assetIndex = category.assets?.findIndex(a => a.assetId == asset.assetId);
        if (assetIndex != -1)
            category.assets.splice(assetIndex, 1);

        this.addUncategorizedAsset(asset);

        this.updateAllocation();

        this.hasChanges = true;

        this.assetDeleted.next(asset);
    }

    addSubCategory(subCategory: CategoryResponse): void {
        this.hasChanges = true;

        this.subCategoryAdded.next(subCategory);
    }

    updateSubCategory(subCategory: CategoryResponse): void {
        this.hasChanges = true;

        this.subCategoryUpdated.next(subCategory);
    }

    deleteSubCategory(category: CategoryResponse, subCategory: CategoryResponse): void {
        let subCategoryIndex = category.subCategories?.findIndex(a => a == subCategory);
        if (subCategoryIndex != 1)
            category.subCategories.splice(subCategoryIndex, 1);

        this.addUncategorizedAssets(subCategory.assets);

        this.updateAllocation();

        this.hasChanges = true;

        this.subCategoryDeleted.next(category);
    }

    private addUncategorizedAsset(asset: CategoryAssetResponse) {
        if (!this.globalCategory)
            return;

        let uncategorizedCategory = this.getUncategorizedCategory(this.globalCategory);
        uncategorizedCategory?.assets?.push(asset);
    }

    private addUncategorizedAssets(assets: CategoryAssetResponse[]) {
        if (!this.globalCategory)
            return;

        let uncategorizedCategory = this.getUncategorizedCategory(this.globalCategory);
        uncategorizedCategory?.assets?.push(...assets);
    }

    private removeUncategorizedAsset(asset: CategoryAssetResponse) {
        if (!this.globalCategory)
            return;

        let uncategorizedCategory = this.getUncategorizedCategory(this.globalCategory);
        let uncategorizedAssetIndex = uncategorizedCategory?.assets?.findIndex(a => a.assetId == asset.assetId);
        if (uncategorizedCategory && uncategorizedAssetIndex != undefined && uncategorizedAssetIndex != -1)
            uncategorizedCategory.assets.splice(uncategorizedAssetIndex, 1);
    }

    private updateAllocation() {
        if (!this.globalCategory)
            return;

        this._allAssets = this.retrieveAssets(this.globalCategory);
        this.calculateAllocations(this.globalCategory);
    }
}
