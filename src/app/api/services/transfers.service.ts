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
     * Path part for operation apiTransfersGet
     */
    static readonly ApiTransfersGetPath = '/api/transfers';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiTransfersGet()` instead.
     *
     * This method doesn't expect any request body.
     */
    apiTransfersGet$Response(params?: {
    }): Observable<StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>> {

        const rb = new RequestBuilder(this.rootUrl, TransfersService.ApiTransfersGetPath, 'get');
        if (params) {
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
     * To access the full response (for headers, for example), `apiTransfersGet$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    apiTransfersGet(params?: {
    }): Observable<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse> {

        return this.apiTransfersGet$Response(params).pipe(
            map((r: StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>) => r.body as FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse)
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
