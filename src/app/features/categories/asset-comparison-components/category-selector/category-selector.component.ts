import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

// TODO: move to shared place
interface CategoryNode {
    expandable: boolean;
    name: string;
    level: number;
    category: CategoryResponse;
}

@Component({
    selector: 'app-category-selector',
    templateUrl: './category-selector.component.html',
    styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit, OnDestroy {
    category: CategoryResponse | null = null;

    // TODO: move to shared place
    _transformer = (category: CategoryResponse, level: number) => {
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

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private categoryOrchestratorService: CategoryOrchestratorService,
        private dialogRef: MatDialogRef<CategorySelectorComponent>,
        private router: Router,
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

    hasChild = (_: number, node: CategoryNode) => node.expandable;

    onCompare(): void {
        this.dialogRef.close();

        this.router.navigate(['/categories/comparison']);
    }
}
