import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { AssetResponse } from '../models/Assets/asset-response';
import { CreateAssetRequest } from '../models/Assets/create-asset-request';
import { WebApiResponse } from '../models/Shared/web-api-response';
import { BaseWebApiResponse } from '../models/Shared/base-web-api-response';
import { ApiServiceBase } from '../api-base-service';

@Injectable()
export class AssetsService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '/assets');
    }

    GetAll(): Observable<WebApiResponse<Array<AssetResponse>>> {
        return this.http.get(this.apiEndpoint)
            .pipe(map((response: any) => response as WebApiResponse<Array<AssetResponse>>));
    }

    GetById(id: string): Observable<WebApiResponse<AssetResponse>> {
        return this.http.get(`${this.apiEndpoint}/${id}`)
            .pipe(map((response: any) => response as WebApiResponse<AssetResponse>));
    }

    Create(request: CreateAssetRequest): Observable<BaseWebApiResponse> {
        return this.http.post(`${this.apiEndpoint}`, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }
}
