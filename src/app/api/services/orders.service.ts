import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { BaseWebApiResponse } from '../models/Shared/base-web-api-response';
import { WebApiResponse } from '../models/Shared/web-api-response';
import { CreateOrderRequest } from '../models/Orders/create-order-request';
import { OrderResponse } from '../models/Orders/order-response';
import { ApiServiceBase } from '../api-base-service';
import { PaginationWebApiResponse } from '../models/Shared/pagination-web-api-response';
import { GetOrdersRequest } from '../models/Orders/get-orders-request';
import { UpdateOrderRequest } from '../models/Orders/update-order-request';

@Injectable()
export class OrdersService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '');
    }

    getAll(accountId: string, request: GetOrdersRequest): Observable<PaginationWebApiResponse<Array<OrderResponse>>> {
        // TODO: move to shared place
        let params = new HttpParams();
        params = params.append('pagination.pageNumber', request.pagination.pageNumber);
        params = params.append('pagination.pageSize', request.pagination.pageSize);
        params = params.append('sorting.field', request.sorting.field);
        params = params.append('sorting.order', request.sorting.order);

        let baseUrl = this.createBaseUrl(accountId);

        return this.http.get(baseUrl, { params })
            .pipe(map((response: any) => response as PaginationWebApiResponse<Array<OrderResponse>>));
    }

    getById(accountId: string, id: string): Observable<WebApiResponse<OrderResponse>> {
        let baseUrl = this.createBaseUrl(accountId, id);

        return this.http.get(baseUrl)
            .pipe(map((response: any) => response as WebApiResponse<OrderResponse>));
    }

    create(accountId: string, request: CreateOrderRequest): Observable<BaseWebApiResponse> {
        let baseUrl = this.createBaseUrl(accountId);

        return this.http.post(baseUrl, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }

    update(accountId: string, id: string, request: UpdateOrderRequest): Observable<BaseWebApiResponse> {
        let baseUrl = this.createBaseUrl(accountId, id);

        return this.http.put(baseUrl, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }

    delete(accountId: string, id: string): Observable<BaseWebApiResponse> {
        let baseUrl = this.createBaseUrl(accountId, id);

        return this.http.delete(baseUrl)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }

    createBaseUrl(accountId: string, id: string | null = null): string {
        let baseUrl = `${this.apiEndpoint}/accounts/${accountId}/orders`;
        if (id) {
            baseUrl += `/${id}`;
        }

        return baseUrl;
    }
}
