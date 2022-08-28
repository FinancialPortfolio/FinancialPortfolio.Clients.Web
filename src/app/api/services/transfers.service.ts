import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { BaseWebApiResponse } from '../models/Shared/base-web-api-response';
import { WebApiResponse } from '../models/Shared/web-api-response';
import { CreateTransferRequest } from '../models/Transfers/create-transfer-request';
import { TransferResponse } from '../models/Transfers/transfer-response';
import { ApiServiceBase } from '../api-base-service';

@Injectable()
export class TransfersService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '/transfers');
    }

    GetAll(): Observable<WebApiResponse<Array<TransferResponse>>> {
        return this.http.get(this.apiEndpoint)
            .pipe(map((response: any) => response as WebApiResponse<Array<TransferResponse>>));
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
