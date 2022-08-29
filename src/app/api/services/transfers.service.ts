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

@Injectable()
export class TransfersService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '/transfers');
    }

    GetAll(request: GetTransfersRequest): Observable<PaginationWebApiResponse<Array<TransferResponse>>> {
        let params = new HttpParams();

        // TODO: move to shared place
        params = params.append('pagination.pageNumber', request.pagination.pageNumber);
        params = params.append('pagination.pageSize', request.pagination.pageSize);

        params = params.append('sorting.field', request.sorting.field);
        params = params.append('sorting.order', request.sorting.order);

        return this.http.get(this.apiEndpoint, { params })
            .pipe(map((response: any) => response as PaginationWebApiResponse<Array<TransferResponse>>));
    }

    GetById(id: string): Observable<WebApiResponse<TransferResponse>> {
        return this.http.get(`${this.apiEndpoint}/${id}`)
            .pipe(map((response: any) => response as WebApiResponse<TransferResponse>));
    }

    Create(request: CreateTransferRequest): Observable<BaseWebApiResponse> {
        return this.http.post(`${this.apiEndpoint}`, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }
}
