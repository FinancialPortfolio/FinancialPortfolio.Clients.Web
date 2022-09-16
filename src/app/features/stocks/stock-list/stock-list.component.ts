import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StockResponse } from 'src/app/api/models/Stocks/stock-response';
import { GetStocksRequest } from 'src/app/api/models/Stocks/get-stocks-request';
import { SortOrder } from 'src/app/api/models/Shared/Search/Sorting/sort-order';
import { StocksService } from 'src/app/api/services/stocks.service';

@Component({
    selector: 'app-stock-list',
    templateUrl: './stock-list.component.html',
    styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {
    stocks: StockResponse[] = [];
    displayedColumns: string[] = ['name', 'symbol', 'exchange'];
    totalSize = 0;

    pageNumber = 0;
    pageSize = 25;

    sortField = "Symbol";
    sortOrder = SortOrder.Asc;

    name = "";
    symbol = "";

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private stocksService: StocksService) { }

    ngOnInit(): void {
        this.loadStocks();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadStocks(): void {
        let request: GetStocksRequest = {
            pagination: {
                pageSize: this.pageSize,
                pageNumber: this.pageNumber + 1
            },
            sorting: {
                field: this.sortField,
                order: this.sortOrder
            },
            name: this.name,
            symbol: this.symbol
        };
        this.stocksService.getAll(request).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.totalSize = result.totalCount;
            this.stocks = result.response;
        });
    }

    paginate(paginate: PageEvent) {
        this.pageNumber = paginate.pageIndex;
        this.pageSize = paginate.pageSize;

        this.loadStocks();
    }

    sort(sort: Sort) {
        this.sortField = sort.active;
        this.sortOrder = sort.direction == "asc" ? SortOrder.Asc : SortOrder.Desc;

        this.loadStocks();
    }
}
