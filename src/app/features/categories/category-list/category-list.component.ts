import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoriesService } from 'src/app/api/services/categories.service';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FetchAssetStatisticsRequest } from 'src/app/api/models/Assets/fetch-asset-statistics-request';
import { AssetsService } from 'src/app/api/services/assets.service';
import { AssetsUpdatedOperation, CategoryUpdatedOperation } from 'src/app/core/models/operations';
import { SuccessfulOperation } from 'src/app/core/models/successful-operation';
import { SignalrService } from 'src/app/core/services/signalr.service';
import { CategoryAllocationService } from '../services/category-allocation.service';
import { NotificationService } from 'src/app/core/services/notification.service';

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

    get category(): CategoryResponse | null {
        return this.categoryAllocationService.category;
    }

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private categoriesService: CategoriesService,
        private categoryAllocationService: CategoryAllocationService,
        private notificationService: NotificationService,
        private signalrService: SignalrService, private assetsService: AssetsService) {
            this.categoryAllocationService.assetAdded.subscribe(() => {
                this.loadedAssetStatistics = false;
            });
         }

    ngOnInit(): void {
        this.loadCategories();

        this.signalrService.operationSucceededSubject.pipe(takeUntil(this.unsubscribe)).subscribe((data: SuccessfulOperation) => {
            if (data.name == AssetsUpdatedOperation) {
                this.categoryAllocationService.updateAssetStatistics(data.payload.assets);

                this.loadedAssetStatistics = true;
            } else if (data.name == CategoryUpdatedOperation) {
                this.categoryAllocationService.isChanged = false;
            }
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadCategories(): void {
        this.categoriesService.getAll().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.categoryAllocationService.category = result.response;
            this.dataSource.data = [result.response];

            if (this.categoryAllocationService.assets)
                this.fetchAssetPrices(this.categoryAllocationService.assets.map(s => s.assetId));

            setTimeout(() => this.setTreeWidth());
        });
    }

    fetchAssetPrices(ids: string[]): void {
        let request: FetchAssetStatisticsRequest = {
            ids
        };

        this.assetsService.fetchAssetStatistics(request).subscribe(() => { });
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

    onNodeSelect(categoryNode: CategoryNode) {
        this.categoryAllocationService.selectedCategory.next(categoryNode.category);
    }

    onSave() {
        if (!this.category || !this.categoryAllocationService.isChanged)
            return;

        this.categoriesService.update(this.category.id, this.category)
            .subscribe(
                () => {
                    this.notificationService.success('Accepted');
                }
            );
    }
}
