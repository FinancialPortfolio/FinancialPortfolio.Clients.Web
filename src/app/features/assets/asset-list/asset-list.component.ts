import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AssetResponse } from 'src/app/api/models/Assets/asset-response';
import { GetAssetsRequest } from 'src/app/api/models/Assets/get-assets-request';
import { SortOrder } from 'src/app/api/models/Shared/Search/Sorting/sort-order';
import { AssetsService } from 'src/app/api/services/assets.service';

@Component({
    selector: 'app-asset-list',
    templateUrl: './asset-list.component.html',
    styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
    assets: AssetResponse[] = [];
    displayedColumns: string[] = ['name', 'symbol', 'exchange', 'type'];
    totalSize = 0;

    pageNumber = 0;
    pageSize = 25;

    sortField = "Symbol";
    sortOrder = SortOrder.Asc;

    name = "";
    symbol = "";
    type = "";

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private assetsService: AssetsService) { }

    ngOnInit(): void {
        this.loadAssets();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loadAssets(): void {
        let request: GetAssetsRequest = {
            pagination: {
                pageSize: this.pageSize,
                pageNumber: this.pageNumber + 1
            },
            sorting: {
                field: this.sortField,
                order: this.sortOrder
            },
            name: this.name,
            symbol: this.symbol,
            type: this.type
        };
        this.assetsService.getAll(request).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
            this.totalSize = result.totalCount;
            this.assets = result.response;
        });
    }

    paginate(paginate: PageEvent) {
        this.pageNumber = paginate.pageIndex;
        this.pageSize = paginate.pageSize;

        this.loadAssets();
    }

    sort(sort: Sort) {
        this.sortField = sort.active;
        this.sortOrder = sort.direction == "asc" ? SortOrder.Asc : SortOrder.Desc;

        this.loadAssets();
    }
}
