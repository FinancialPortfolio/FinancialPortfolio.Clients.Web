import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AssetResponse } from 'src/app/api/models/Assets/asset-response';
import { AssetResponse as CategoryAssetResponse } from 'src/app/api/models/Categories/asset-response';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { OrderType } from 'src/app/api/models/Orders/order-type';

@Injectable({
    providedIn: 'root'
})
export class CategoryAllocationService {
    _category: CategoryResponse | null = null;
    _assets: CategoryAssetResponse[] | null = null;
    selectedCategory = new BehaviorSubject<CategoryResponse | null>(null);

    // Try to get rid of these events somehow
    assetAdded = new Subject<CategoryAssetResponse>();
    assetUpdated = new Subject<CategoryAssetResponse>();
    assetDeleted = new Subject<CategoryAssetResponse>();

    public get category() : CategoryResponse | null {
        return this._category;
    }
    public set category(category: CategoryResponse | null) {
        this._category = category;

        if (!category)
            return;

        this._assets = this.retrieveAssets(category);

        this.selectedCategory.next(category);
    }

    public get assets() : CategoryAssetResponse[] | null {
        return this._assets;
    }

    constructor() { }

    getAsset(assetId: string): CategoryAssetResponse | null {
        if (!this.assets)
            return null;

        return this.assets.find(a => a.assetId == assetId) ?? null;
    }

    addAsset(asset: CategoryAssetResponse): void {
        this.assetAdded.next(asset);

        this.removeUncategorizedAsset(asset);
    }

    updateAsset(asset: CategoryAssetResponse): void {
        this.assetUpdated.next(asset);
    }

    deleteAsset(category: CategoryResponse, asset: CategoryAssetResponse): void {
        let assetIndex = category.assets?.findIndex(a => a.assetId == asset.assetId);
        if (assetIndex)
            category.assets.splice(assetIndex, 1);

        this.updateAllocation();

        this.assetDeleted.next(asset);
    }

    private removeUncategorizedAsset(asset: CategoryAssetResponse) {
        if (!this.category)
            return;

        let uncategorizedCategory = this.uncategorizedCategory(this.category);
        let uncategorizedAssetIndex = uncategorizedCategory?.assets?.findIndex(a => a.assetId == asset.assetId);
        if (uncategorizedCategory && uncategorizedAssetIndex)
            uncategorizedCategory.assets.splice(uncategorizedAssetIndex, 1);
    }

    uncategorizedCategory(category: CategoryResponse): CategoryResponse | null {
        if (category.name == "Uncategorized")
            return category;

        for (let subCategory of category.subCategories) {
            let uncategorizedCategory = this.uncategorizedCategory(subCategory);
            if (uncategorizedCategory)
                return uncategorizedCategory;
        }

        return null;
    }

    public updateAssetStatistics(payloadAssets: AssetResponse[]) {
        if (this._assets === null)
            return;

        if (this.category)
            this._assets = this.retrieveAssets(this.category);

        for (let asset of this._assets) {
            let payloadAsset = payloadAssets.find((a: AssetResponse) => a.id == asset.assetId);
            if (payloadAsset)
                asset.assetStatistics = payloadAsset.assetStatistics;
        }

        if (this.category)
            this.calculateAllocations(this.category);
    }

    private updateAllocation() {
        if (!this.category)
            return;

        this._assets = this.retrieveAssets(this.category);
        this.calculateAllocations(this.category);
    }

    private retrieveAssets(category: CategoryResponse): CategoryAssetResponse[] {
        let assets: CategoryAssetResponse[] = [];

        if (category.assets)
            assets.push(...category.assets);

        for (let subCategory of category.subCategories ?? []) {
            assets.push(...this.retrieveAssets(subCategory));
        }

        return assets;
    }

    private calculateAllocations(category: CategoryResponse) {
        for (let asset of category.assets ?? []) {
            let price = asset.assetStatistics?.currentPrice ?? 0;
            asset.allocation = price * this.numberOfShares(asset);
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

    private numberOfShares(asset: CategoryAssetResponse): number {
        return asset.orders.reduce((totalShares, order) => {
            if (order.type == OrderType.Buy) {
                return totalShares + order.amount;
            }

            return totalShares - order.amount;
        }, 0);
    }
}
