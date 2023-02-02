import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { CategoriesService } from 'src/app/api/services/categories.service';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { FetchAssetStatisticsRequest } from 'src/app/api/models/Assets/fetch-asset-statistics-request';
import { AssetsService } from 'src/app/api/services/assets.service';
import { AssetsUpdatedOperation, CategoryUpdatedOperation, UpdateCategoryOperation } from 'src/app/core/models/operations';
import { SuccessfulOperation } from 'src/app/core/models/successful-operation';
import { SignalrService } from 'src/app/core/services/signalr.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CategoryOrchestratorService } from '../services/category-orchestrator.service';
import { AssetResponse } from 'src/app/api/models/Assets/asset-response';
import { FailedOperation } from 'src/app/core/models/failed-operation';
import { CategorySelectorComponent } from '../asset-comparison-components/category-selector/category-selector.component';

@Component({
    selector: 'app-category-orchestrator',
    templateUrl: './category-orchestrator.component.html',
    styleUrls: ['./category-orchestrator.component.scss']
})
export class CategoryOrchestratorComponent implements OnInit, OnDestroy {
    isSaving = false;
    contentBlockWidth = '100%';

    get category(): CategoryResponse | null {
        return this.categoryOrchestratorService.globalCategory;
    }

    get isChanged(): boolean {
        return this.categoryOrchestratorService.hasChanges;
    }

    private readonly unsubscribe: Subject<void> = new Subject();

    get showComparision(): boolean {
        return this.categoryOrchestratorService.showComparision;
    }

    constructor(
        private dialog: MatDialog,
        private categoriesService: CategoriesService,
        private categoryOrchestratorService: CategoryOrchestratorService,
        private notificationService: NotificationService,
        private signalrService: SignalrService,
        private assetsService: AssetsService) {
        }

    ngOnInit(): void {
        this.loadCategories();

        this.signalrService.operationSucceededSubject.pipe(takeUntil(this.unsubscribe)).subscribe((data: SuccessfulOperation) => {
            switch(data.name) {
                case AssetsUpdatedOperation:
                    this.AssetsUpdated(data.payload.assets)
                   break;
                case CategoryUpdatedOperation: {
                    this.isSaving = false;
                    this.categoryOrchestratorService.hasChanges = false;

                    break;
                }
                default:
                   break;
             }
        });

        this.signalrService.operationFailedSubject.pipe(takeUntil(this.unsubscribe)).subscribe((data: FailedOperation) => {
            if (data.name == UpdateCategoryOperation) {
                this.isSaving = false;
            }
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    setCategoryTreeWidth(width: number): void {
        this.contentBlockWidth = `calc(100% - ${width}px)`;
    }

    onSave() {
        if (!this.category || !this.isChanged)
            return;

        this.isSaving = true;

        this.categoriesService.update(this.category)
            .subscribe(
                () => {
                    this.notificationService.success('Accepted');
                },
                () => {
                    this.isSaving = false;
                }
            );
    }

    selectCategories() {
        this.dialog.open(CategorySelectorComponent, {
            width: '450px',
            data: {
                category: this.category
            }
        });
    }

    showCategories() {
        this.categoryOrchestratorService.showComparision = false;
    }

    showComparisson() {
        this.categoryOrchestratorService.showComparision = true;
    }

    private AssetsUpdated(assets: AssetResponse[]) {
        this.categoryOrchestratorService.updateAssetStatistics(assets);
    }

    private loadCategories(): void {
        this.categoriesService.getAll().subscribe(result => {
            this.categoryOrchestratorService.globalCategory = result.response;

            if (this.categoryOrchestratorService.allAssets)
                this.fetchAssetPrices(this.categoryOrchestratorService.allAssets.map(s => s.assetId));
        });
    }

    private fetchAssetPrices(ids: string[]): void {
        let request: FetchAssetStatisticsRequest = {
            ids
        };

        this.assetsService.fetchAssetStatistics(request).subscribe(() => { });
    }
}
