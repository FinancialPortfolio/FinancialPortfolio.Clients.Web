import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoriesService } from 'src/app/api/services/categories.service';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FetchAssetStatisticsRequest } from 'src/app/api/models/Assets/fetch-asset-statistics-request';
import { AssetsService } from 'src/app/api/services/assets.service';
import { AssetsUpdatedOperation } from 'src/app/core/models/operations';
import { SuccessfulOperation } from 'src/app/core/models/successful-operation';
import { SignalrService } from 'src/app/core/services/signalr.service';
import { AssetResponse as CategoryAssetResponse } from 'src/app/api/models/Categories/asset-response';
import { AssetResponse } from 'src/app/api/models/Assets/asset-response';
import { OrderType } from 'src/app/api/models/Orders/order-type';

interface CategoryNode {
    expandable: boolean;
    name: string;
    level: number;
    category: CategoryResponse;
}

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {
    @ViewChild('categoriesTree') categoriesTree: any;
    @ViewChild('categoriesTree', { static: false, read: ElementRef }) categoriesTreeElement: any;

    private _transformer = (category: CategoryResponse, level: number) => {
        return {
            expandable: category.subCategories && category.subCategories.length > 0,
            name: category.name,
            level: level,
            category: category
        };
    };

    treeControl = new FlatTreeControl<CategoryNode>(
        node => node.level,
        node => node.expandable,
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => node.subCategories,
    );

    treeBlockWidth: string = 'fit-content';
    contentBlockWidth: string = '100%';
    loadedAssetStatistics = false;

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    category: CategoryResponse | null = null;
    assets: CategoryAssetResponse[] | null = null;
    selectedCategory: CategoryResponse | undefined;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private categoriesService: CategoriesService,
        private signalrService: SignalrService, private assetsService: AssetsService,) { }

    ngOnInit(): void {
        this.loadCategories();

        this.signalrService.operationSucceededSubject.pipe(takeUntil(this.unsubscribe)).subscribe((data: SuccessfulOperation) => {
            if (data.name != AssetsUpdatedOperation)
                return;

            if (this.assets === null)
                return;

            for (let asset of this.assets) {
                asset.assetStatistics = data.payload.assets.find((s: AssetResponse) => s.id == asset.assetId)?.assetStatistics;
            }

            if (this.category)
                this.calculateAllocations(this.category);

            this.loadedAssetStatistics = true;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadCategories(): void {
        this.categoriesService.getAll().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.category = result.response;
            this.dataSource.data = [result.response];

            if (this.category)
                this.selectedCategory = this.category;

            this.assets = this.retrieveAssets(this.category);

            this.fetchAssetPrices(this.assets.map(s => s.symbol));

            setTimeout(() => this.setTreeWidth());
        });
    }

    retrieveAssets(category: CategoryResponse): CategoryAssetResponse[] {
        let assets: CategoryAssetResponse[] = [];

        if (category.assets)
            assets.push(...category.assets);

        for (let subCategory of category.subCategories ?? []) {
            assets.push(...this.retrieveAssets(subCategory));
        }

        return assets;
    }

    fetchAssetPrices(symbols: string[]): void {
        let request: FetchAssetStatisticsRequest = {
            symbols
        };

        this.assetsService.fetchAssetStatistics(request).subscribe(() => { });
    }

    calculateAllocations(category: CategoryResponse) {
        for (let asset of category.assets ?? []) {
            asset.allocation = asset.assetStatistics!.currentPrice * this.numberOfShares(asset);
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

    numberOfShares(asset: CategoryAssetResponse): number {
        return asset.orders.reduce((totalShares, order) => {
            if (order.type == OrderType.Buy) {
                return totalShares + order.amount;
            }

            return totalShares - order.amount;
        }, 0);
    }

    setTreeWidth() {
        this.categoriesTree.treeControl.expandAll();

        setTimeout(() => {
            let clientWidth = this.categoriesTreeElement.nativeElement.clientWidth;
            this.treeBlockWidth = clientWidth + 'px';
            this.contentBlockWidth = `calc(100% - ${clientWidth}px)`;
        })
    }

    hasChild = (_: number, node: CategoryNode) => node.expandable;

    onSelect(category: CategoryResponse) {
        this.selectedCategory = category
    }

    onNodeSelect(categoryNode: CategoryNode) {
        this.onSelect(categoryNode.category);
    }
}
