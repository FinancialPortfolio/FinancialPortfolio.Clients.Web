import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { SubCategoryEditComponent } from '../../action-components/sub-category-edit/sub-category-edit.component';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

@Component({
    selector: 'app-category-sub-category-item',
    templateUrl: './category-sub-category-item.component.html',
    styleUrls: ['./category-sub-category-item.component.scss']
})
export class CategorySubCategoryItemComponent implements OnInit {
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

    constructor(private dialog: MatDialog, private categoryOrchestratorService: CategoryOrchestratorService) {
        this.categoryOrchestratorService.subCategoryAdded.subscribe(() => {
            this.subCategoriesDataSource.data = this.category.subCategories;
        });
        this.categoryOrchestratorService.subCategoryDeleted.subscribe(() => {
            this.subCategoriesDataSource.data = this.category.subCategories;
        });
    }

    ngOnInit(): void {
    }

    sortSubCategories(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        this.subCategoriesDataSource.data = this.sortData(this.subCategoriesDataSource.data, sort);
    }

    sortData(array: any[], sort: Sort): any[] {
        return array.sort((a, b) => {
            const aValue = (a as any)[sort.active];
            const bValue = (b as any)[sort.active];
            return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
    }

    editSubCategory(subCategory: CategoryResponse): void {
        this.dialog.open(SubCategoryEditComponent, {
            width: '500px',
            data: { subCategory }
        });
    }

    deleteSubCategory(subCategory: CategoryResponse): void {
        this.categoryOrchestratorService.deleteSubCategory(this.category, subCategory);
    }
}
