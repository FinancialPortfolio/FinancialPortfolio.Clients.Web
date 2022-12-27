import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { SubCategoryAddComponent } from '../../action-components/sub-category-add/sub-category-add.component';
import { AssetAddComponent } from '../../action-components/asset-add/asset-add.component';
import { SubCategoryEditComponent } from '../../action-components/sub-category-edit/sub-category-edit.component';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-category-item',
    templateUrl: './category-item.component.html',
    styleUrls: ['./category-item.component.scss']
})
export class CategoryItemComponent implements OnDestroy {
    category!: CategoryResponse;

    isUncategorizedCategory = false;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private dialog: MatDialog, private categoryOrchestratorService: CategoryOrchestratorService) {
        this.categoryOrchestratorService.selectedCategory.pipe(takeUntil(this.unsubscribe)).subscribe(selectedCategory => {
            if (!selectedCategory)
                return;

            this.category = selectedCategory;

            this.isUncategorizedCategory = this.categoryOrchestratorService.isUncategorized(this.category);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    hasCategories(): boolean {
        return this.categoryOrchestratorService.hasCategories(this.category);
    }

    hasAssets(): boolean {
        return this.categoryOrchestratorService.hasAssets(this.category);
    }

    empty(): boolean {
        return !this.hasCategories() && !this.hasAssets();
    }

    addCategory(): void {
        this.dialog.open(SubCategoryAddComponent, {
            width: '500px',
            data: { category: this.category }
        });
    }

    deleteCurrentCategory(): void {
        if (!this.categoryOrchestratorService.globalCategory)
            return;

        let parentCategory = this.categoryOrchestratorService.getParentCategory(this.categoryOrchestratorService.globalCategory, this.category);
        if (!parentCategory)
            return;

        this.categoryOrchestratorService.deleteSubCategory(parentCategory, this.category);
        this.categoryOrchestratorService.selectedCategory.next(parentCategory);
    }

    editCurrentCategory(): void {
        this.dialog.open(SubCategoryEditComponent, {
            width: '500px',
            data: { subCategory: this.category }
        });
    }

    addAsset(): void {
        this.dialog.open(AssetAddComponent, {
            width: '500px',
            data: { category: this.category }
        });
    }
}
