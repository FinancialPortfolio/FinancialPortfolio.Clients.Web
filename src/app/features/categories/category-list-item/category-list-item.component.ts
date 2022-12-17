import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LegendPosition } from '@swimlane/ngx-charts';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { StockResponse } from 'src/app/api/models/Categories/stock-response';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { StockAddComponent } from '../stock-add/stock-add.component';

@Component({
    selector: 'app-category-list-item',
    templateUrl: './category-list-item.component.html',
    styleUrls: ['./category-list-item.component.scss']
})
export class CategoryListItemComponent {
    @Output()
    select = new EventEmitter<CategoryResponse>();

    category!: CategoryResponse;
    @Input() set categoryItem(value: CategoryResponse) {
        this.category = value;

        if (this.category.subCategories.length > 0) {
            let sortedCategories = this.category.subCategories.sort((a,b) => b.expectedAllocationInPercentage - a.expectedAllocationInPercentage)

            this.allocationsChart = sortedCategories.map(category => ({ name: category.name, value: category.allocationInPercentage }));
            this.expectedAllocationsChart = sortedCategories.map(category => ({ name: category.name, value: category.expectedAllocationInPercentage }));
        } else if (this.category.stocks.length > 0) {
            let sortedStocks = this.category.stocks.sort((a,b) => b.expectedAllocationInPercentage - a.expectedAllocationInPercentage)

            this.allocationsChart = sortedStocks.map(stock => ({ name: stock.name, value: stock.allocationInPercentage }));
            this.expectedAllocationsChart = sortedStocks.map(stock => ({ name: stock.name, value: stock.expectedAllocationInPercentage }));
        }
    }

    categoriesDisplayedColumns: string[] = ['name', 'description', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
    stocksDisplayedColumns: string[] = ['symbol', 'name', 'allocation', 'allocationInPercentage', 'expectedAllocationInPercentage', 'actions'];
    comparissonDisplayedColumns: string[] = ['symbol', 'marketCapitalization', 'priceToEarningsValue', 'priceToSalesValue', 'priceToBookValue', 'dividendYield', 'beta']

    allocationsChart: {name: string, value: number}[] = [];
    expectedAllocationsChart: {name: string, value: number}[] = [];

    pieOptions = {
        gradient: true,
        showLegend: false,
        showLabels: true,
        isDoughnut: false,
        legendPosition: LegendPosition.Below,
        colorScheme: "nightLights"
    };

    constructor(private dialog: MatDialog) { }

    addCategory(): void {
        this.dialog.open(CategoryAddComponent, {
            width: '500px',
            data: { item: this.category }
        });
    }

    addStock(): void {
        this.dialog.open(StockAddComponent, {
            width: '500px',
            data: { item: this.category }
        });
    }

    hasCategories(): boolean {
        return this.category.subCategories != null && this.category.subCategories.length > 0;
    }

    hasStocks(): boolean {
        return this.category.stocks != null && this.category.stocks.length > 0;
    }

    editCurrentCategory(): void {
        alert('edit shold be here');
    }

    editSubCategory(category: CategoryResponse): void {
        alert('edit shold be here');
    }

    deleteSubCategory(category: CategoryResponse): void {
        alert('delete shold be here');
    }

    editStock(stock: StockResponse): void {
        alert('edit shold be here');
    }

    deleteStock(stock: StockResponse): void {
        alert('delete shold be here');
    }

    onSelect(data: any): void {
        if (this.category.subCategories.length == 0)
            return;

        let selectedCategory = this.category.subCategories.find(c => c.name == data.name);
        this.select.emit(selectedCategory);
    }
}
