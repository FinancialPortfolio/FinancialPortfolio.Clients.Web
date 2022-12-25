import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { AssetResponse } from 'src/app/api/models/Assets/asset-response';

@Component({
    selector: 'app-category-orchestrator',
    templateUrl: './category-orchestrator.component.html',
    styleUrls: ['./category-orchestrator.component.scss']
})
export class CategoryOrchestratorComponent implements OnInit, OnDestroy {
    loadedAssetStatistics = false;

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
            this.categoryOrchestratorService.assetAdded.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
                this.loadedAssetStatistics = false;
            });
        }

    ngOnInit(): void {
        this.loadCategories();

        this.signalrService.operationSucceededSubject.pipe(takeUntil(this.unsubscribe)).subscribe((data: SuccessfulOperation) => {
            switch(data.name) {
                case AssetsUpdatedOperation:
                    this.AssetsUpdated(data.payload.assets)
                   break;
                case CategoryUpdatedOperation:
                    this.categoryOrchestratorService.hasChanges = false;
                    break;
                default:
                   break;
             }
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
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

    private AssetsUpdated(assets: AssetResponse[]) {
        this.categoryOrchestratorService.updateAssetStatistics(assets);

        this.loadedAssetStatistics = true;
    }

    private loadCategories(): void {
        this.categoriesService.getAll().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
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
