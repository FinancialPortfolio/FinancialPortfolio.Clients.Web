import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { NotificationService } from 'src/app/core/services/notification.service';
import { sortArray } from 'src/app/shared/helpers/sorting.helper';
import { SubCategoryEditComponent } from '../../action-components/sub-category-edit/sub-category-edit.component';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

@Component({
    selector: 'app-category-sub-category-item',
    templateUrl: './category-sub-category-item.component.html',
    styleUrls: ['./category-sub-category-item.component.scss']
})
export class CategorySubCategoryItemComponent implements OnInit, OnDestroy {
    @Input()
    set categoryItem(category: CategoryResponse) {
        this.category = category;

        this.subCategoriesDataSource.data = this.category.subCategories;

        this.isUncategorizedCategory = this.categoryOrchestratorService.isUncategorized(this.category);
    }

    category!: CategoryResponse;
    isUncategorizedCategory = false;

    subCategoriesDataSource = new MatTableDataSource<CategoryResponse>();
    categoriesDisplayedColumns: string[] = ['name', 'description', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private dialog: MatDialog, private categoryOrchestratorService:  CategoryOrchestratorService, private notificationService: NotificationService) {
        this.categoryOrchestratorService.subCategoryAdded.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.subCategoriesDataSource.data = this.category.subCategories;
        });
        this.categoryOrchestratorService.subCategoryDeleted.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.subCategoriesDataSource.data = this.category.subCategories;
        });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    sortSubCategories(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        this.subCategoriesDataSource.data = sortArray(this.subCategoriesDataSource.data, sort.active, sort.direction === "asc");
    }

    editSubCategory(subCategory: CategoryResponse, event: Event): void {
        this.dialog.open(SubCategoryEditComponent, {
            width: '500px',
            data: { subCategory }
        });

        event.stopPropagation();
    }

    deleteSubCategory(subCategory: CategoryResponse, event: Event): void {
        this.notificationService.confirm("Confirm action", "Do you want to delete this category?").subscribe(result => {
            if (!result)
                return;

            this.categoryOrchestratorService.deleteSubCategory(this.category, subCategory);
        });

        event.stopPropagation();
    }

    onSelect(category: CategoryResponse) {
        this.categoryOrchestratorService.selectedCategory.next(category);
    }
}
