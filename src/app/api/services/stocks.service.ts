import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { StockResponse } from '../models/Stocks/stock-response';
import { ApiServiceBase } from '../api-base-service';
import { GetStocksRequest } from '../models/Stocks/get-stocks-request';
import { PaginationWebApiResponse } from '../models/Shared/pagination-web-api-response';
import { FetchStockStatisticsRequest } from '../models/Stocks/fetch-stock-statistics-request';
import { BaseWebApiResponse } from '../models/Shared/base-web-api-response';

@Injectable()
export class StocksService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '/stocks');
    }

    getAll(request: GetStocksRequest): Observable<PaginationWebApiResponse<Array<StockResponse>>> {
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
            .pipe(map((response: any) => response as PaginationWebApiResponse<Array<StockResponse>>));
    }

    fetchStockStatistics(request: FetchStockStatisticsRequest): Observable<BaseWebApiResponse> {
        return this.http.patch(`${this.apiEndpoint}/stock-statistics`, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }
}
