import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AssetResponse } from 'src/app/api/models/Assets/asset-response';
import { AssetResponse as CategoryAssetResponse } from 'src/app/api/models/Categories/asset-response';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { OrderType } from 'src/app/api/models/Orders/order-type';
import { numberOfShares } from 'src/app/shared/helpers/asset-calculation.helper';

@Injectable({
    providedIn: 'root'
})
export class CategoryCalculationService {
    _globalCategory: CategoryResponse | null = null;
    _allAssets: CategoryAssetResponse[] | null = null;
    selectedCategory = new BehaviorSubject<CategoryResponse | null>(null);

    hasChanges = false;

    readonly UncategorizedCategoryName = "Uncategorized";

    public get globalCategory() : CategoryResponse | null {
        return this._globalCategory;
    }
    public set globalCategory(category: CategoryResponse | null) {
        this._globalCategory = category;

        if (!category)
            return;

        this._allAssets = this.retrieveAssets(category);

        this.setSelectedCategories(category);

        this.hasChanges = false;

        this.selectedCategory.next(category);
    }

    public get allAssets() : CategoryAssetResponse[] | null {
        return this._allAssets;
    }

    constructor() { }

    public getAsset(assetId: string): CategoryAssetResponse | null {
        if (!this.allAssets)
            return null;

        return this.allAssets.find(a => a.assetId == assetId) ?? null;
    }

    public isUncategorized(category: CategoryResponse) {
        return category.name == this.UncategorizedCategoryName;
    }

    public getUncategorizedCategory(category: CategoryResponse): CategoryResponse | null {
        if (this.isUncategorized(category))
            return category;

        for (let subCategory of category.subCategories) {
            let uncategorizedCategory = this.getUncategorizedCategory(subCategory);
            if (uncategorizedCategory)
                return uncategorizedCategory;
        }

        return null;
    }

    public getTreeLevel(category: CategoryResponse, level = 1): number {
        if (!category.subCategories?.length)
            return level;

        let maxTreeLevels = [];

        for (let subCategory of category.subCategories) {
            let treeLevel = this.getTreeLevel(subCategory, level + 1);
            maxTreeLevels.push(treeLevel);
        }

        return Math.max(...maxTreeLevels);
    }

    public getParentCategory(childCategory: CategoryResponse): CategoryResponse | null {
        if (!this.globalCategory)
            return null;

        return this.getParent(this.globalCategory, childCategory);
    }

    private getParent(category: CategoryResponse, childCategory: CategoryResponse): CategoryResponse | null {
        if (category == childCategory)
            return null;

        if (category.subCategories.includes(childCategory))
            return category;

        for (let subCategory of category.subCategories) {
            let parentCategory = this.getParent(subCategory, childCategory);
            if (parentCategory)
                return parentCategory;
        }

        return null;
    }

    public updateAssetStatistics(payloadAssets: AssetResponse[]) {
        if (this._allAssets === null)
            return;

        if (this.globalCategory)
            this._allAssets = this.retrieveAssets(this.globalCategory);

        for (let asset of this._allAssets) {
            let payloadAsset = payloadAssets.find((a: AssetResponse) => a.id == asset.assetId);
            if (payloadAsset)
                asset.assetStatistics = payloadAsset.assetStatistics;
        }

        if (this.globalCategory)
            this.calculateAllocations(this.globalCategory);
    }

    protected retrieveAssets(category: CategoryResponse): CategoryAssetResponse[] {
        let assets: CategoryAssetResponse[] = [];

        if (category.assets)
            assets.push(...category.assets);

        for (let subCategory of category.subCategories ?? []) {
            assets.push(...this.retrieveAssets(subCategory));
        }

        return assets;
    }

    protected setSelectedCategories(category: CategoryResponse): void {
        category.isSelected = true;

        for (let subCategory of category.subCategories ?? []) {
            this.setSelectedCategories(subCategory);
        }
    }

    protected calculateAllocations(category: CategoryResponse) {
        for (let asset of category.assets ?? []) {
            let price = asset.assetStatistics?.currentPrice ?? 0;
            asset.allocation = price * numberOfShares(asset);
        }

        for (let subCategory of category.subCategories ?? []) {
            this.calculateAllocations(subCategory);
        }

        category.allocation = category.assets?.reduce((sum, current) => sum + current.allocation, 0) ?? 0;
        category.allocation += category.subCategories?.reduce((sum, current) => sum + current.allocation, 0) ?? 0;

        for (let asset of category.assets ?? []) {
            asset.allocationInPercentage = category.allocation ? asset.allocation / category.allocation * 100 : 0;
        }

        for (let subCategory of category.subCategories ?? []) {
            subCategory.allocationInPercentage = category.allocation ? subCategory.allocation / category.allocation * 100 : 0;
        }
    }
}
