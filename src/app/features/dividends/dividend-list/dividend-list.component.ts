import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { AccountDividendResponse } from 'src/app/api/models/Dividends/account-dividend-response';
import { GetAccountDividendsRequest } from 'src/app/api/models/Dividends/get-account-dividends-request';
import { DividendsService } from 'src/app/api/services/dividends.service';
import { sortArray } from 'src/app/shared/helpers/sorting.helper';
import { AppState } from 'src/app/store/app.reducers';

@Component({
    selector: 'app-dividend-list',
    templateUrl: './dividend-list.component.html',
    styleUrls: ['./dividend-list.component.scss']
})
export class DividendListComponent implements OnInit {
    @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
        if (!paginator)
            return;

        this.dividendsDataSource.paginator = paginator;
    }

    dividends: AccountDividendResponse[] = [];
    assets: {symbol: string, id: string}[] = [];

    totalDividends = 0;
    averageReturn = 0;

    dividendsDataSource = new MatTableDataSource<AccountDividendResponse>();
    displayedColumns: string[] = ['paymentDate', 'exDate', 'symbol', 'quantity', 'dividendPerShare', 'frequency', 'amount'];

    selectedAssetId = "";
    startDateTime = new Date();
    endDateTime = new Date();

    selectedAccount: AccountResponse | undefined;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private store: Store<AppState>,
        private dividendsService: DividendsService) { }

    ngOnInit(): void {
        var currentDate = new Date();
        this.startDateTime = new Date(currentDate.getFullYear() - 1, 0, 1);
        this.endDateTime = new Date(currentDate.getFullYear(), 11, 31);

        this.store.pipe(takeUntil(this.unsubscribe)).subscribe((state: AppState) => {
            this.selectedAccount = state.accounts.selectedAccount;
            this.selectedAssetId = "";

            this.loadDividends();
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    sort(sort: Sort) {
        if (!sort.active || sort.direction === '')
            return;

        this.dividendsDataSource.data = sortArray(this.dividends, sort.active, sort.direction === "asc");
    }

    loadDividends(): void {
        if (!this.selectedAccount)
            return;

        let request: GetAccountDividendsRequest = {
            startDateTime: new Date(this.startDateTime),
            endDateTime: new Date(this.endDateTime),
            assetId: this.selectedAssetId ?? null
        };

        this.dividendsService.getAll(this.selectedAccount.id, request).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.dividends = result.response;

            this.dividendsDataSource.data = sortArray(result.response, "paymentDate", true);
            this.fillAssets(result.response);
            this.fillSummary(result.response);
        });
    }

    private fillAssets(dividends: AccountDividendResponse[]) {
        if (this.selectedAssetId)
            return;

        this.assets = dividends.filter(this.uniqueAssets).map(d => ({ symbol: d.symbol, id: d.assetId }));
    }

    private uniqueAssets(current: AccountDividendResponse, index: number, all: AccountDividendResponse[]) {
        return all.findIndex(item => item.assetId == current.assetId) === index;
    }

    private fillSummary(dividends: AccountDividendResponse[]) {
        this.totalDividends = dividends.reduce((sum, current) => sum + this.roundDividends(current.amount), 0);
    }

    private roundDividends(value: number) {
        return -Math.round(-value * 100) / 100;
    }
}
