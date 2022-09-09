import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import { AccountStockResponse } from 'src/app/api/models/AccountStocks/account-stock-response';
import { AccountStocksService } from 'src/app/api/services/account-stocks.service';
import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { AppState } from 'src/app/store/app.reducers';
import { OrderType } from 'src/app/api/models/Orders/order-type';

@Component({
    selector: 'app-account-stock-list',
    templateUrl: './account-stock-list.component.html',
    styleUrls: ['./account-stock-list.component.scss']
})
export class AccountStockListComponent implements OnInit {
    stocks: AccountStockResponse[] = [];
    selectedAccount: AccountResponse | undefined;
    displayedColumns: string[] = ['type', 'price', 'amount', 'total', 'dateTime', 'commission'];

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private store: Store<AppState>, private accountStocksService: AccountStocksService) { }

    ngOnInit(): void {
        this.store.pipe(takeUntil(this.unsubscribe)).subscribe(
            (state: AppState) => {
                this.selectedAccount = state.accounts.selectedAccount;

                this.loadStocks();
            }
        );
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadStocks(): void {
        if (!this.selectedAccount)
            return;

        this.accountStocksService.GetAll(this.selectedAccount.id).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.stocks = result.response;

            // TODO: remove when the price will be fetched from be
            this.stocks.forEach(stock => {
                stock.price = 100;
            });
        });
    }

    invested(stock: AccountStockResponse): number {
        return this.averageSharePrice(stock) * this.numberOfShares(stock);
    }

    price(stock: AccountStockResponse): number {
        return stock.price * this.numberOfShares(stock);
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
}
