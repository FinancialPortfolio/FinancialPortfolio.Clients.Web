import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { WebApiResponse } from '../models/Shared/web-api-response';
import { ApiServiceBase } from '../api-base-service';
import { AccountStockResponse } from '../models/AccountStocks/account-stock-response';
import { GetAccountStocksRequest } from '../models/AccountStocks/get-account-stocks-request';

@Injectable()
export class AccountStocksService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '');
    }

    getAll(accountId: string, request: GetAccountStocksRequest): Observable<WebApiResponse<Array<AccountStockResponse>>> {
        let baseUrl = this.createBaseUrl(accountId);

        let params = new HttpParams();
        if (request.type) {
            params = params.append('type', request.type);
        }

        return this.http.get(baseUrl, { params })
            .pipe(map((response: any) => response as WebApiResponse<Array<AccountStockResponse>>));
    }

    createBaseUrl(accountId: string, id: string | null = null): string {
        let baseUrl = `${this.apiEndpoint}/accounts/${accountId}/stocks`;
        return baseUrl;
    }
}
