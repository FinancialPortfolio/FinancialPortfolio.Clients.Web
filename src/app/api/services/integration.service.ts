import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { BaseWebApiResponse } from '../models/Shared/base-web-api-response';
import { ApiServiceBase } from '../api-base-service';
import { IntegrateRequest } from '../models/Integration/integrate-request';

@Injectable()
export class IntegrationService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '');
    }

    integrate(accountId: string, request: IntegrateRequest): Observable<BaseWebApiResponse> {
        let baseUrl = `${this.apiEndpoint}/accounts/${accountId}/integration`;

        var formData: any = new FormData();
        formData.append("file", request.file);
        formData.append("source", request.source);

        return this.http.put(baseUrl, formData)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }
}
