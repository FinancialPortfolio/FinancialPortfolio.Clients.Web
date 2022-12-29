import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryOrchestratorService } from '../services/category-orchestrator.service';

interface CategoryNode {
    expandable: boolean;
    level: number;
    category: CategoryResponse;
}

@Component({
    selector: 'app-category-tree',
    templateUrl: './category-tree.component.html',
    styleUrls: ['./category-tree.component.scss']
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

    _transformer = (category: CategoryResponse, level: number): CategoryNode => {
        return {
            expandable: category.subCategories && category.subCategories.length > 0,
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

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private categoryOrchestratorService: CategoryOrchestratorService) {
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

    expandAllNodes() {
        this.categoriesTree.treeControl.expandAll();
    }

    setTreeWidth() {
        let clientWidth = this.categoriesTreeElement.nativeElement.clientWidth;
        this.treeBlockWidth = clientWidth + 'px';

        this.categoryTreeWidthSet.next(clientWidth);
    }

    hasChild = (_: number, node: CategoryNode) => node.expandable;

    onNodeSelect(categoryNode: CategoryNode) {
        this.categoryOrchestratorService.selectedCategory.next(categoryNode.category);
    }
}
