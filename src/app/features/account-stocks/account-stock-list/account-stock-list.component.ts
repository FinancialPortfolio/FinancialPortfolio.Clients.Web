import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import { AccountStockResponse } from 'src/app/api/models/AccountStocks/account-stock-response';
import { AccountStocksService } from 'src/app/api/services/account-stocks.service';
import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { AppState } from 'src/app/store/app.reducers';
import { OrderType } from 'src/app/api/models/Orders/order-type';
import { StocksService } from 'src/app/api/services/stocks.service';
import { FetchAssetStatisticsRequest } from 'src/app/api/models/Stocks/fetch-stock-statistics-request';
import { SignalrService } from 'src/app/core/services/signalr.service';
import { StocksUpdatedOperation } from 'src/app/core/models/operations';
import { SuccessfulOperation } from 'src/app/core/models/successful-operation';
import { StockResponse } from 'src/app/api/models/Stocks/stock-response';
import { GetAccountStocksRequest } from 'src/app/api/models/AccountStocks/get-account-stocks-request';

@Component({
    selector: 'app-account-stock-list',
    templateUrl: './account-stock-list.component.html',
    styleUrls: ['./account-stock-list.component.scss']
})
export class AccountStockListComponent implements OnInit {
    stocks: AccountStockResponse[] = [];
    selectedAccount: AccountResponse | undefined;
    displayedColumns: string[] = ['type', 'price', 'amount', 'total', 'dateTime', 'commission'];
    type = "";

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private store: Store<AppState>,
        private signalrService: SignalrService,
        private stocksService: StocksService,
        private accountStocksService: AccountStocksService) { }

    ngOnInit(): void {
        this.store.pipe(takeUntil(this.unsubscribe)).subscribe(
            (state: AppState) => {
                this.selectedAccount = state.accounts.selectedAccount;

                this.loadStocks();
            }
        );

        this.signalrService.operationSucceededSubject.pipe(takeUntil(this.unsubscribe)).subscribe((data: SuccessfulOperation) => {
            if (data.name != StocksUpdatedOperation)
                return;

            this.stocks.forEach((stock: AccountStockResponse) => {
                stock.assetStatistics = data.payload.stocks.find((s: StockResponse) => s.id == stock.id)?.assetStatistics;
            });
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadStocks(): void {
        if (!this.selectedAccount)
            return;

        let request: GetAccountStocksRequest = {
            type: this.type
        };
        this.accountStocksService.getAll(this.selectedAccount.id, request).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.stocks = result.response;

            this.fetchStockPrices(this.stocks.map(s => s.symbol));
        });
    }

    fetchStockPrices(symbols: string[]): void {
        let request: FetchAssetStatisticsRequest = {
            symbols
        };

        this.stocksService.fetchAssetStatistics(request).subscribe(() => { });
    }

    invested(stock: AccountStockResponse): number {
        return this.averageSharePrice(stock) * this.numberOfShares(stock);
    }

    totalPrice(stock: AccountStockResponse): number | null {
        if (stock.assetStatistics == null)
            return null;

        return stock.assetStatistics?.currentPrice * this.numberOfShares(stock);
    }

    averageSharePrice(stock: AccountStockResponse): number {
        let averagePrice = 0;
        let numberOfShares = 0;

        for (let order of stock.orders) {
            if (order.type === OrderType.Buy) {
                averagePrice = (averagePrice * numberOfShares + order.price * order.amount) / (numberOfShares + order.amount);
                numberOfShares += order.amount;
            } else {
                numberOfShares -= order.amount;
            }
        }

        return averagePrice;
    }

    numberOfShares(stock: AccountStockResponse): number {
        return stock.orders.reduce((totalShares, order) => {
            if (order.type == OrderType.Buy) {
                return totalShares + order.amount;
            }

            return totalShares - order.amount;
        }, 0);
    }

    getLogo(stock: AccountStockResponse): string {
        if (stock.assetStatistics?.logo == null || stock.assetStatistics?.logo == "")
            return "assets/images/stock.png";

        return stock.assetStatistics?.logo;
    }
}
