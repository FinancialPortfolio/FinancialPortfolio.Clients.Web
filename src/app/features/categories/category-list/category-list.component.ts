import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoriesService } from 'src/app/api/services/categories.service';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FetchStockStatisticsRequest } from 'src/app/api/models/Stocks/fetch-stock-statistics-request';
import { StocksService } from 'src/app/api/services/stocks.service';
import { StocksUpdatedOperation } from 'src/app/core/models/operations';
import { SuccessfulOperation } from 'src/app/core/models/successful-operation';
import { SignalrService } from 'src/app/core/services/signalr.service';
import { StockResponse as CategoryStockResponse } from 'src/app/api/models/Categories/stock-response';
import { StockResponse } from 'src/app/api/models/Stocks/stock-response';
import { OrderType } from 'src/app/api/models/Orders/order-type';

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
export class CategoryListComponent implements OnInit, OnDestroy {
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
    loadedStockStatistics = false;

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    category: CategoryResponse | null = null;
    stocks: CategoryStockResponse[] | null = null;
    selectedCategory: CategoryResponse | undefined;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private categoriesService: CategoriesService,
        private signalrService: SignalrService, private stocksService: StocksService,) { }

    ngOnInit(): void {
        this.loadCategories();

        this.signalrService.operationSucceededSubject.pipe(takeUntil(this.unsubscribe)).subscribe((data: SuccessfulOperation) => {
            if (data.name != StocksUpdatedOperation)
                return;

            if (this.stocks === null)
                return;

            for (let stock of this.stocks) {
                stock.stockStatistics = data.payload.stocks.find((s: StockResponse) => s.id == stock.assetId)?.stockStatistics;
            }

            if (this.category)
                this.calculateAllocations(this.category);

            this.loadedStockStatistics = true;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadCategories(): void {
        this.categoriesService.getAll().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.category = result.response;
            this.dataSource.data = [result.response];

            if (this.category)
                this.selectedCategory = this.category;

            this.stocks = this.retrieveStocks(this.category);

            this.fetchStockPrices(this.stocks.map(s => s.symbol));

            setTimeout(() => this.setTreeWidth());
        });
    }

    retrieveStocks(category: CategoryResponse): CategoryStockResponse[] {
        let stocks: CategoryStockResponse[] = [];

        if (category.stocks)
            stocks.push(...category.stocks);

        for (let subCategory of category.subCategories ?? []) {
            stocks.push(...this.retrieveStocks(subCategory));
        }

        return stocks;
    }

    fetchStockPrices(symbols: string[]): void {
        let request: FetchStockStatisticsRequest = {
            symbols
        };

        this.stocksService.fetchStockStatistics(request).subscribe(() => { });
    }

    calculateAllocations(category: CategoryResponse) {
        for (let stock of category.stocks ?? []) {
            stock.allocation = stock.stockStatistics!.currentPrice * this.numberOfShares(stock);
        }

        for (let subCategory of category.subCategories ?? []) {
            this.calculateAllocations(subCategory);
        }

        category.allocation = category.stocks?.reduce((sum, current) => sum + current.allocation, 0) ?? 0;
        category.allocation += category.subCategories?.reduce((sum, current) => sum + current.allocation, 0) ?? 0;

        for (let stock of category.stocks ?? []) {
            stock.allocationInPercentage = category.allocation ? stock.allocation / category.allocation * 100 : 0;
        }

        for (let subCategory of category.subCategories ?? []) {
            subCategory.allocationInPercentage = category.allocation ? subCategory.allocation / category.allocation * 100 : 0;
        }
    }

    numberOfShares(stock: CategoryStockResponse): number {
        return stock.orders.reduce((totalShares, order) => {
            if (order.type == OrderType.Buy) {
                return totalShares + order.amount;
            }

            return totalShares - order.amount;
        }, 0);
    }

    setTreeWidth() {
        this.categoriesTree.treeControl.expandAll();

        setTimeout(() => {
            let clientWidth = this.categoriesTreeElement.nativeElement.clientWidth;
            this.treeBlockWidth = clientWidth + 'px';
            this.contentBlockWidth = `calc(100% - ${clientWidth}px)`;
        })
    }

    hasChild = (_: number, node: CategoryNode) => node.expandable;

    onSelect(category: CategoryResponse) {
        this.selectedCategory = category
    }

    onNodeSelect(categoryNode: CategoryNode) {
        this.onSelect(categoryNode.category);
    }
}
