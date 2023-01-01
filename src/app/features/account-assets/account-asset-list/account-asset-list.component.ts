import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import { AccountAssetResponse } from 'src/app/api/models/AccountAssets/account-asset-response';
import { AccountAssetsService } from 'src/app/api/services/account-assets.service';
import { AccountResponse } from 'src/app/api/models/Accounts/account-response';
import { AppState } from 'src/app/store/app.reducers';
import { AssetsService } from 'src/app/api/services/assets.service';
import { FetchAssetStatisticsRequest } from 'src/app/api/models/Assets/fetch-asset-statistics-request';
import { SignalrService } from 'src/app/core/services/signalr.service';
import { AssetsUpdatedOperation } from 'src/app/core/models/operations';
import { SuccessfulOperation } from 'src/app/core/models/successful-operation';
import { AssetResponse } from 'src/app/api/models/Assets/asset-response';
import { GetAccountAssetsRequest } from 'src/app/api/models/AccountAssets/get-account-assets-request';
import { invested, numberOfShares, totalPrice } from 'src/app/shared/helpers/asset-calculation.helper';

@Component({
    selector: 'app-account-asset-list',
    templateUrl: './account-asset-list.component.html',
    styleUrls: ['./account-asset-list.component.scss']
})
export class AccountAssetListComponent implements OnInit {
    assets: AccountAssetResponse[] = [];
    selectedAccount: AccountResponse | undefined;
    displayedColumns: string[] = ['type', 'price', 'amount', 'total', 'dateTime', 'commission'];
    type = "";

    numberOfShares = numberOfShares;
    invested = invested;
    totalPrice = totalPrice;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private store: Store<AppState>,
        private signalrService: SignalrService,
        private assetsService: AssetsService,
        private accountAssetsService: AccountAssetsService) { }

    ngOnInit(): void {
        this.store.pipe(takeUntil(this.unsubscribe)).subscribe(
            (state: AppState) => {
                this.selectedAccount = state.accounts.selectedAccount;

                this.loadAssets();
            }
        );

        this.signalrService.operationSucceededSubject.pipe(takeUntil(this.unsubscribe)).subscribe((data: SuccessfulOperation) => {
            if (data.name != AssetsUpdatedOperation)
                return;

            this.assets.forEach((asset: AccountAssetResponse) => {
                asset.assetStatistics = data.payload.assets.find((s: AssetResponse) => s.id == asset.id)?.assetStatistics;
            });
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadAssets(): void {
        if (!this.selectedAccount)
            return;

        let request: GetAccountAssetsRequest = {
            type: this.type
        };
        this.accountAssetsService.getAll(this.selectedAccount.id, request).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.assets = result.response;

            this.fetchAssetPrices(this.assets.map(s => s.id));
        });
    }

    fetchAssetPrices(ids: string[]): void {
        let request: FetchAssetStatisticsRequest = {
            ids
        };

        this.assetsService.fetchAssetStatistics(request).subscribe(() => { });
    }

    getLogo(asset: AccountAssetResponse): string {
        if (asset.assetStatistics?.logo == null || asset.assetStatistics?.logo == "")
            return "assets/images/asset.png";

        return asset.assetStatistics?.logo;
    }
}
