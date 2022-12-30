import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource } from '@angular/material/tree';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryOrchestratorService } from '../services/category-orchestrator.service';
import { CategoryNode } from '../models/category-node.model';
import { TreeService } from '../services/tree.service';
import { TreeControl } from '@angular/cdk/tree';

@Component({
    selector: 'app-category-tree',
    templateUrl: './category-tree.component.html',
    styleUrls: ['./category-tree.component.scss'],
    providers: [TreeService]
})
export class CategoryTreeComponent implements OnInit, OnDestroy {
    @Input()
    set categoryItem(category: CategoryResponse) {
        this.category = category;

        this.dataSource.data = [category];

        setTimeout(() => {
            this.expandAllNodes();

            setTimeout(() => this.setTreeWidth());
        });
    }
    @Output()
    categoryTreeWidthSet = new EventEmitter<number>();

    @ViewChild('categoriesTree') categoriesTree: any;
    @ViewChild('categoriesTree', { static: false, read: ElementRef }) categoriesTreeElement: any;

    category!: CategoryResponse;
    dataSource = new MatTreeFlatDataSource(this.treeService.treeControl, this.treeService.treeFlattener);
    treeBlockWidth: string = 'fit-content';

    hasChild = this.treeService.hasChild;

    get treeControl(): TreeControl<CategoryNode> {
        return this.treeService.treeControl;
    }

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private categoryOrchestratorService: CategoryOrchestratorService, private treeService: TreeService) {
        this.categoryOrchestratorService.subCategoryAdded.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.updateCategoryDataSource();
        });
        this.categoryOrchestratorService.subCategoryUpdated.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.updateCategoryDataSource();
        });
        this.categoryOrchestratorService.subCategoryDeleted.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.updateCategoryDataSource();
        });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    updateCategoryDataSource() {
        if (!this.category)
            return;

        let expandedNodes = this.treeService.saveExpandedNodes();
        this.dataSource.data = [this.category];

        setTimeout(() => {
            this.setTreeWidth();

            this.treeService.restoreExpandedNodes(expandedNodes);
        });
    }

    expandAllNodes() {
        this.categoriesTree.treeControl.expandAll();
    }

    setTreeWidth() {
        let clientWidth = this.categoriesTreeElement.nativeElement.clientWidth;
        this.treeBlockWidth = clientWidth + 'px';

        this.categoryTreeWidthSet.next(clientWidth);
    }

    onNodeSelect(categoryNode: CategoryNode) {
        this.categoryOrchestratorService.selectedCategory.next(categoryNode.category);
    }
}
