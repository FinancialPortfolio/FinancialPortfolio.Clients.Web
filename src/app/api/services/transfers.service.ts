/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { CreateTransferRequest as FinancialPortfolioApiGatewayContractsEquityRequestsCreateTransferRequest } from '../models/FinancialPortfolio/APIGateway/Contracts/Equity/Requests/create-transfer-request';
import { WebApiResponse as FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse } from '../models/FinancialPortfolio/Infrastructure/WebApi/Models/Response/web-api-response';
import { SearchOptions as FinancialPortfolioSearchSearchOptions } from '../models/FinancialPortfolio/Search/search-options';
import { TransferResponse as TransferApiTransferResponse } from '../models/TransferApi/transfer-response';

@Injectable({
    providedIn: 'root',
})
export class TransfersService extends BaseService {
    constructor(
        config: ApiConfiguration,
        http: HttpClient
    ) {
        super(config, http);
    }

    /**
     * Path part for operation apiTransfersFindPost
     */
    static readonly ApiTransfersFindPostPath = '/api/transfers/find';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiTransfersFindPost()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiTransfersFindPost$Response(params?: {
        body?: FinancialPortfolioSearchSearchOptions
    }): Observable<StrictHttpResponse<Array<TransferApiTransferResponse>>> {

        const rb = new RequestBuilder(this.rootUrl, TransfersService.ApiTransfersFindPostPath, 'post');
        if (params) {
            rb.body(params.body, 'application/*+json');
        }

        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(
            filter((r: any) => r instanceof HttpResponse),
            map((r: HttpResponse<any>) => {
                return r as StrictHttpResponse<Array<TransferApiTransferResponse>>;
            })
        );
    }

    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiTransfersFindPost$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiTransfersFindPost(params?: {
        body?: FinancialPortfolioSearchSearchOptions
    }): Observable<Array<TransferApiTransferResponse>> {

        return this.apiTransfersFindPost$Response(params).pipe(
            map((r: StrictHttpResponse<Array<TransferApiTransferResponse>>) => r.body as Array<TransferApiTransferResponse>)
        );
    }

    /**
     * Path part for operation apiTransfersIdGet
     */
    static readonly ApiTransfersIdGetPath = '/api/transfers/{id}';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiTransfersIdGet()` instead.
     *
     * This method doesn't expect any request body.
     */
    apiTransfersIdGet$Response(params: {
        id: string;
    }): Observable<StrictHttpResponse<TransferApiTransferResponse>> {

        const rb = new RequestBuilder(this.rootUrl, TransfersService.ApiTransfersIdGetPath, 'get');
        if (params) {
            rb.path('id', params.id, {});
        }

        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(
            filter((r: any) => r instanceof HttpResponse),
            map((r: HttpResponse<any>) => {
                return r as StrictHttpResponse<TransferApiTransferResponse>;
            })
        );
    }

    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiTransfersIdGet$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    apiTransfersIdGet(params: {
        id: string;
    }): Observable<TransferApiTransferResponse> {

        return this.apiTransfersIdGet$Response(params).pipe(
            map((r: StrictHttpResponse<TransferApiTransferResponse>) => r.body as TransferApiTransferResponse)
        );
    }

    /**
     * Path part for operation apiTransfersPost
     */
    static readonly ApiTransfersPostPath = '/api/transfers';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiTransfersPost()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiTransfersPost$Response(params?: {
        body?: FinancialPortfolioApiGatewayContractsEquityRequestsCreateTransferRequest
    }): Observable<StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>> {

        const rb = new RequestBuilder(this.rootUrl, TransfersService.ApiTransfersPostPath, 'post');
        if (params) {
            rb.body(params.body, 'application/*+json');
        }

        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(
            filter((r: any) => r instanceof HttpResponse),
            map((r: HttpResponse<any>) => {
                return r as StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>;
            })
        );
    }

    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiTransfersPost$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiTransfersPost(params?: {
        body?: FinancialPortfolioApiGatewayContractsEquityRequestsCreateTransferRequest
    }): Observable<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse> {

        return this.apiTransfersPost$Response(params).pipe(
            map((r: StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>) => r.body as FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse)
        );
    }

}
