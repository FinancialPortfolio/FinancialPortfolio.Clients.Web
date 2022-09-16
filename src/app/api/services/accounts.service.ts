import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { AccountResponse } from '../models/Accounts/account-response';
import { CreateAccountRequest } from '../models/Accounts/create-account-request';
import { UpdateAccountRequest } from '../models/Accounts/update-account-request';
import { WebApiResponse } from '../models/Shared/web-api-response';
import { BaseWebApiResponse } from '../models/Shared/base-web-api-response';
import { ApiServiceBase } from '../api-base-service';

@Injectable()
export class AccountsService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '/accounts');
    }

    getAll(): Observable<WebApiResponse<Array<AccountResponse>>> {
        return this.http.get(this.apiEndpoint)
            .pipe(map((response: any) => response as WebApiResponse<Array<AccountResponse>>));
    }

    getById(id: string): Observable<WebApiResponse<AccountResponse>> {
        return this.http.get(`${this.apiEndpoint}/${id}`)
            .pipe(map((response: any) => response as WebApiResponse<AccountResponse>));
    }

    create(request: CreateAccountRequest): Observable<BaseWebApiResponse> {
        return this.http.post(`${this.apiEndpoint}`, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }

    update(id: string, request: UpdateAccountRequest): Observable<BaseWebApiResponse> {
        return this.http.put(`${this.apiEndpoint}/${id}`, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }

    delete(id: string): Observable<BaseWebApiResponse> {
        return this.http.delete(`${this.apiEndpoint}/${id}`)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }
}
