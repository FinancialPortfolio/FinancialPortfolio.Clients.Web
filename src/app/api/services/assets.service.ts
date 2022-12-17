import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { AssetResponse } from '../models/Assets/asset-response';
import { ApiServiceBase } from '../api-base-service';
import { GetAssetsRequest } from '../models/Assets/get-assets-request';
import { PaginationWebApiResponse } from '../models/Shared/pagination-web-api-response';
import { FetchAssetStatisticsRequest } from '../models/Assets/fetch-asset-statistics-request';
import { BaseWebApiResponse } from '../models/Shared/base-web-api-response';

@Injectable()
export class AssetsService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '/assets');
    }

    getAll(request: GetAssetsRequest): Observable<PaginationWebApiResponse<Array<AssetResponse>>> {
        // TODO: move to shared place
        let params = new HttpParams();

        if (request.pagination) {
            params = params.append('pagination.pageNumber', request.pagination.pageNumber);
            params = params.append('pagination.pageSize', request.pagination.pageSize);
        }

        if (request.sorting) {
            params = params.append('sorting.field', request.sorting.field);
            params = params.append('sorting.order', request.sorting.order);
        }

        if (request.name) {
            params = params.append('name', request.name);
        }

        if (request.symbol) {
            params = params.append('symbol', request.symbol);
        }

        if (request.type) {
            params = params.append('type', request.type);
        }

        return this.http.get(this.apiEndpoint, { params })
            .pipe(map((response: any) => response as PaginationWebApiResponse<Array<AssetResponse>>));
    }

    fetchAssetStatistics(request: FetchAssetStatisticsRequest): Observable<BaseWebApiResponse> {
        return this.http.patch(`${this.apiEndpoint}/asset-statistics`, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }
}
