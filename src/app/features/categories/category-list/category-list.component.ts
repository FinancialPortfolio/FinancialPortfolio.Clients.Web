import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoriesService } from 'src/app/api/services/categories.service';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { FetchAssetStatisticsRequest } from 'src/app/api/models/Assets/fetch-asset-statistics-request';
import { AssetsService } from 'src/app/api/services/assets.service';
import { AssetsUpdatedOperation, CategoryUpdatedOperation } from 'src/app/core/models/operations';
import { SuccessfulOperation } from 'src/app/core/models/successful-operation';
import { SignalrService } from 'src/app/core/services/signalr.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CategoryOrchestratorService } from '../services/category-orchestrator.service';

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
        return this.categoryOrchestratorService.globalCategory;
    }

    get isChanged(): boolean {
        return this.categoryOrchestratorService.hasChanges;
    }

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private categoriesService: CategoriesService,
        private categoryOrchestratorService: CategoryOrchestratorService,
        private notificationService: NotificationService,
        private signalrService: SignalrService, private assetsService: AssetsService) {
            this.categoryOrchestratorService.assetAdded.subscribe(() => {
                this.loadedAssetStatistics = false;
            });
            this.categoryOrchestratorService.subCategoryAdded.subscribe(() => {
                this.updateCategoryDataSource();
            });
            this.categoryOrchestratorService.subCategoryUpdated.subscribe(() => {
                this.updateCategoryDataSource();
            });
            this.categoryOrchestratorService.subCategoryDeleted.subscribe(() => {
                this.updateCategoryDataSource();
            });
        }

    updateCategoryDataSource() {
        if (!this.category)
            return;

        let expandedNodes = this.saveExpandedNodes();
        this.dataSource.data = [this.category];
        setTimeout(() => {
            this.setTreeWidth();

            this.restoreExpandedNodes(expandedNodes);
        });
    }

    saveExpandedNodes(): CategoryNode[] {
        let expandedNodes = new Array<CategoryNode>();
        this.treeControl.dataNodes.forEach(node => {
            if (node.expandable && this.treeControl.isExpanded(node)) {
                expandedNodes.push(node);
            }
        });
        return expandedNodes;
    }

    restoreExpandedNodes(expandedNodes: CategoryNode[]) {
        expandedNodes.forEach(node => {
            let dataNode = this.treeControl.dataNodes.find(n => n.category === node.category);
            if (dataNode)
                this.treeControl.expand(dataNode);
        });
    }

    ngOnInit(): void {
        this.loadCategories();

        this.signalrService.operationSucceededSubject.pipe(takeUntil(this.unsubscribe)).subscribe((data: SuccessfulOperation) => {
            if (data.name == AssetsUpdatedOperation) {
                this.categoryOrchestratorService.updateAssetStatistics(data.payload.assets);

                this.loadedAssetStatistics = true;
            } else if (data.name == CategoryUpdatedOperation) {
                this.categoryOrchestratorService.hasChanges = false;
            }
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadCategories(): void {
        this.categoriesService.getAll().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.categoryOrchestratorService.globalCategory = result.response;
            this.dataSource.data = [result.response];

            if (this.categoryOrchestratorService.allAssets)
                this.fetchAssetPrices(this.categoryOrchestratorService.allAssets.map(s => s.assetId));

            setTimeout(() => {
                this.expandAllNodes();

                setTimeout(() => this.setTreeWidth());
            });
        });
    }

    fetchAssetPrices(ids: string[]): void {
        let request: FetchAssetStatisticsRequest = {
            ids
        };

        this.assetsService.fetchAssetStatistics(request).subscribe(() => { });
    }

    expandAllNodes() {
        this.categoriesTree.treeControl.expandAll();
    }

    setTreeWidth() {
        let clientWidth = this.categoriesTreeElement.nativeElement.clientWidth;
        this.treeBlockWidth = clientWidth + 'px';
        this.contentBlockWidth = `calc(100% - ${clientWidth}px)`;
    }

    hasChild = (_: number, node: CategoryNode) => node.expandable;

    onNodeSelect(categoryNode: CategoryNode) {
        this.categoryOrchestratorService.selectedCategory.next(categoryNode.category);
    }

    onSave() {
        if (!this.category || !this.isChanged)
            return;

        this.categoriesService.update(this.category)
            .subscribe(
                () => {
                    this.notificationService.success('Accepted');
                }
            );
    }
}
