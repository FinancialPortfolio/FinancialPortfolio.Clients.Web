import { TreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeFlatDataSource } from '@angular/material/tree';
import { Subject } from 'rxjs';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryNode } from '../../models/category-node.model';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';
import { TreeService } from '../../services/tree.service';

@Component({
    selector: 'app-category-selector',
    templateUrl: './category-selector.component.html',
    styleUrls: ['./category-selector.component.scss'],
    providers: [TreeService]
})
export class CategorySelectorComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('categoriesTree') categoriesTree: any;

    category: CategoryResponse | null = null;
    dataSource = new MatTreeFlatDataSource(this.treeService.treeControl, this.treeService.treeFlattener);

    get treeControl(): TreeControl<CategoryNode> {
        return this.treeService.treeControl;
    }

    hasChild = this.treeService.hasChild;
    getLevel = this.treeService.getLevel;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private categoryOrchestratorService: CategoryOrchestratorService,
        private treeService: TreeService,
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

    expandAllNodes() {
        this.categoriesTree.treeControl.expandAll();
    }

    selectCategory(category: CategoryResponse, event: any): void {
        let value = category.isPartiallySelected ? false : !category.isSelected;

        category.isSelected = value;
        category.isPartiallySelected = false;

        this.setChildCategories(category, value);
        this.setParentCategories(category);

        this.categoryOrchestratorService.comparisonSelectionUpdated.next();

        event.preventDefault();
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
