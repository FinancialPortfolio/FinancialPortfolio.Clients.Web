import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoriesService } from 'src/app/api/services/categories.service';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

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
export class CategoryListComponent implements OnInit, OnDestroy, AfterViewInit {
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

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    categories: CategoryResponse[] = [];
    selectedCategory: CategoryResponse | undefined;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private categoriesService: CategoriesService) { }

    ngOnInit(): void {
        this.loadCategories();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    ngAfterViewInit() {
        this.categoriesTree.treeControl.expandAll();

        setTimeout(() => {
            let clientWidth = this.categoriesTreeElement.nativeElement.clientWidth;
            this.treeBlockWidth = clientWidth + 'px';
            this.contentBlockWidth = `calc(100% - ${clientWidth}px)`;
        });
    }

    loadCategories(): void {
        this.categoriesService.getAll().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.categories = result.response;
            this.dataSource.data = [{
                id: "",
                name: "All",
                description: "",
                subCategories: result.response,
                allocation: 100,
                expectedAllocation: 100,
                stocks: [],
                userId: ""
            }];

            if (this.categories.length > 0)
                this.selectedCategory = this.categories[0];
        });
    }

    hasChild = (_: number, node: CategoryNode) => node.expandable;

    onSelect(category: CategoryResponse) {
        this.selectedCategory = category
    }

    onNodeSelect(categoryNode: CategoryNode) {
        this.onSelect(categoryNode.category);
    }
}
