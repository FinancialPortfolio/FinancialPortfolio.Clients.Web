import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { WebApiResponse } from '../models/Shared/web-api-response';
import { ApiServiceBase } from '../api-base-service';
import { AccountAssetResponse } from '../models/AccountAssets/account-asset-response';
import { GetAccountAssetsRequest } from '../models/AccountAssets/get-account-assets-request';

@Injectable()
export class AccountAssetsService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '');
    }

    getAll(accountId: string, request: GetAccountAssetsRequest): Observable<WebApiResponse<Array<AccountAssetResponse>>> {
        let baseUrl = this.createBaseUrl(accountId);

        let params = new HttpParams();
        if (request.type) {
            params = params.append('type', request.type);
        }

        return this.http.get(baseUrl, { params })
            .pipe(map((response: any) => response as WebApiResponse<Array<AccountAssetResponse>>));
    }

    createBaseUrl(accountId: string, id: string | null = null): string {
        let baseUrl = `${this.apiEndpoint}/accounts/${accountId}/assets`;
        return baseUrl;
    }
}
