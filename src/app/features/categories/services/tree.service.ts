import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { MatTreeFlattener } from '@angular/material/tree';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryNode } from '../models/category-node.model';

@Injectable({
    providedIn: 'root'
})
export class TreeService {
    public transformer = (category: CategoryResponse, level: number): CategoryNode => {
        return {
            expandable: category.subCategories && category.subCategories.length > 0,
            level: level,
            category: category,
            subCategories: category.subCategories
        };
    };

    public treeControl = new FlatTreeControl<CategoryNode>(
        node => node.level,
        node => node.expandable,
    );

    public treeFlattener = new MatTreeFlattener(
        this.transformer,
        node => node.level,
        node => node.expandable,
        node => node.subCategories
    );

    public hasChild = (_: number, node: CategoryNode) => node.expandable;

    public getLevel = (node: CategoryNode) => node.level;

    public saveExpandedNodes(): CategoryNode[] {
        let expandedNodes = new Array<CategoryNode>();

        this.treeControl.dataNodes.forEach(node => {
            if (node.expandable && this.treeControl.isExpanded(node)) {
                expandedNodes.push(node);
            }
        });

        return expandedNodes;
    }

    public restoreExpandedNodes(expandedNodes: CategoryNode[]) {
        expandedNodes.forEach(node => {
            let dataNode = this.treeControl.dataNodes.find(n => n.category === node.category);
            if (dataNode)
                this.treeControl.expand(dataNode);
        });
    }
}
