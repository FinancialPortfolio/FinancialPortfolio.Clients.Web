import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { Subject } from 'rxjs';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

// TODO: move to shared place
interface CategoryNode {
    expandable: boolean;
    level: number;
    category: CategoryResponse;
    subCategories: CategoryResponse[];
}

@Component({
    selector: 'app-category-selector',
    templateUrl: './category-selector.component.html',
    styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit, OnDestroy, AfterViewInit {
    category: CategoryResponse | null = null;
    @ViewChild('categoriesTree') categoriesTree: any;

    // TODO: move to shared place
    _transformer = (category: CategoryResponse, level: number): CategoryNode => {
        return {
            expandable: category.subCategories && category.subCategories.length > 0,
            level: level,
            category: category,
            subCategories: category.subCategories
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
        node => node.subCategories
    );

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private categoryOrchestratorService: CategoryOrchestratorService,
        @Inject(MAT_DIALOG_DATA) data: { category: CategoryResponse }) {
        this.category = data.category;
        this.dataSource.data = [data.category];
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    ngAfterViewInit(): void {
        this.expandAllNodes();
    }

    hasChild = (_: number, node: CategoryNode) => node.expandable;

    getLevel = (node: CategoryNode) => node.level;

    expandAllNodes() {
        this.categoriesTree.treeControl.expandAll();
    }

    selectCategory(category: CategoryResponse, event: any): void {
        let value = category.isPartiallySelected ? false : !category.isSelected;

        category.isSelected = value;
        category.isPartiallySelected = false;

        this.setChildCategories(category, value);
        this.setParentCategories(category);

        event.preventDefault();

        this.categoryOrchestratorService.comparisonSelectionUpdated.next();
    }

    setChildCategories(category: CategoryResponse, value: boolean) {
        for (let subCategory of category.subCategories) {
            subCategory.isSelected = value;
            category.isPartiallySelected = false;

            this.setChildCategories(subCategory, value);
        }
    }

    setParentCategories(category: CategoryResponse) {
        let parent = this.categoryOrchestratorService.getParentCategory(category);
        while (parent) {
            parent.isSelected = this.descendantsAllSelected(parent);
            parent.isPartiallySelected = this.descendantsPartiallySelected(parent);

            parent = this.categoryOrchestratorService.getParentCategory(parent);
        }
    }

    private descendantsAllSelected(category: CategoryResponse): boolean {
        if (!this.categoryOrchestratorService.hasCategories(category))
            return category.isSelected;

        return category.subCategories.every(subCategory => this.descendantsAllSelected(subCategory));
    }

    private descendantsPartiallySelected(category: CategoryResponse): boolean {
        if (!this.categoryOrchestratorService.hasCategories(category))
            return false;

        return category.subCategories.some(subCategory => this.anyDescendantsSelected(subCategory)) && !this.descendantsAllSelected(category);
    }

    private anyDescendantsSelected(category: CategoryResponse): boolean {
        if (!this.categoryOrchestratorService.hasCategories(category))
            return category.isSelected;

        return category.subCategories.some(subCategory => this.anyDescendantsSelected(subCategory));
    }
}
