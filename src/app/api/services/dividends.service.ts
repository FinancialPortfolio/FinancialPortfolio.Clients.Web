import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { WebApiResponse } from '../models/Shared/web-api-response';
import { ApiServiceBase } from '../api-base-service';
import { GetAccountDividendsRequest } from '../models/Dividends/get-account-dividends-request';
import { AccountDividendResponse } from '../models/Dividends/account-dividend-response';

@Injectable()
export class DividendsService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '');
    }

    getAll(accountId: string, request: GetAccountDividendsRequest): Observable<WebApiResponse<Array<AccountDividendResponse>>> {
        let params = new HttpParams();
        params = params.append('startDateTime', request.startDateTime.toDateString());
        params = params.append('endDateTime', request.endDateTime.toDateString());

        if (request.assetId)
            params = params.append('assetId', request.assetId);

        let baseUrl = `${this.apiEndpoint}/accounts/${accountId}/dividends`;
        return this.http.get(baseUrl, { params })
            .pipe(map((response: any) => response as WebApiResponse<Array<AccountDividendResponse>>));
    }
}
