import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { BaseWebApiResponse } from '../models/Shared/base-web-api-response';
import { WebApiResponse } from '../models/Shared/web-api-response';
import { CreateTransferRequest } from '../models/Transfers/create-transfer-request';
import { TransferResponse } from '../models/Transfers/transfer-response';
import { ApiServiceBase } from '../api-base-service';
import { PaginationWebApiResponse } from '../models/Shared/pagination-web-api-response';
import { GetTransfersRequest } from '../models/Transfers/get-transfers-request';
import { UpdateTransferRequest } from '../models/Transfers/update-transfer-request';

@Injectable()
export class TransfersService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '');
    }

    GetAll(accountId: string, request: GetTransfersRequest): Observable<PaginationWebApiResponse<Array<TransferResponse>>> {
        // TODO: move to shared place
        let params = new HttpParams();
        params = params.append('pagination.pageNumber', request.pagination.pageNumber);
        params = params.append('pagination.pageSize', request.pagination.pageSize);
        params = params.append('sorting.field', request.sorting.field);
        params = params.append('sorting.order', request.sorting.order);

        let baseUrl = this.CreateBaseUrl(accountId);

        return this.http.get(baseUrl, { params })
            .pipe(map((response: any) => response as PaginationWebApiResponse<Array<TransferResponse>>));
    }

    GetById(accountId: string, id: string): Observable<WebApiResponse<TransferResponse>> {
        let baseUrl = this.CreateBaseUrl(accountId, id);

        return this.http.get(baseUrl)
            .pipe(map((response: any) => response as WebApiResponse<TransferResponse>));
    }

    Create(accountId: string, request: CreateTransferRequest): Observable<BaseWebApiResponse> {
        let baseUrl = this.CreateBaseUrl(accountId);

        return this.http.post(baseUrl, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }

    Update(accountId: string, id: string, request: UpdateTransferRequest): Observable<BaseWebApiResponse> {
        let baseUrl = this.CreateBaseUrl(accountId, id);

        return this.http.put(baseUrl, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }

    Delete(accountId: string, id: string): Observable<BaseWebApiResponse> {
        let baseUrl = this.CreateBaseUrl(accountId, id);

        return this.http.delete(baseUrl)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }

    CreateBaseUrl(accountId: string, id: string | null = null): string {
        let baseUrl = `${this.apiEndpoint}/accounts/${accountId}/transfers`;
        if (id) {
            baseUrl += `/${id}`;
        }

        return baseUrl;
    }
}
