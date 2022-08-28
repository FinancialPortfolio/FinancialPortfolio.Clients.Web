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

import { AccountResponse as AccountApiAccountResponse } from '../models/AccountApi/account-response';
import { CreateAccountRequest as FinancialPortfolioApiGatewayContractsAccountsRequestsCreateAccountRequest } from '../models/FinancialPortfolio/APIGateway/Contracts/Accounts/Requests/create-account-request';
import { UpdateAccountRequest as FinancialPortfolioApiGatewayContractsAccountsRequestsUpdateAccountRequest } from '../models/FinancialPortfolio/APIGateway/Contracts/Accounts/Requests/update-account-request';
import { WebApiResponse as FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse } from '../models/FinancialPortfolio/Infrastructure/WebApi/Models/Response/web-api-response';
import { SearchOptions as FinancialPortfolioSearchSearchOptions } from '../models/FinancialPortfolio/Search/search-options';

@Injectable({
    providedIn: 'root',
})
export class AccountsService extends BaseService {
    constructor(
        config: ApiConfiguration,
        http: HttpClient
    ) {
        super(config, http);
    }

    /**
     * Path part for operation apiAccountsFindPost
     */
    static readonly ApiAccountsFindPostPath = '/api/accounts/find';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiAccountsFindPost()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiAccountsFindPost$Response(params?: {
        body?: FinancialPortfolioSearchSearchOptions
    }): Observable<StrictHttpResponse<Array<AccountApiAccountResponse>>> {

        const rb = new RequestBuilder(this.rootUrl, AccountsService.ApiAccountsFindPostPath, 'post');
        if (params) {
            rb.body(params.body, 'application/*+json');
        }

        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(
            filter((r: any) => r instanceof HttpResponse),
            map((r: HttpResponse<any>) => {
                return r as StrictHttpResponse<Array<AccountApiAccountResponse>>;
            })
        );
    }

    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiAccountsFindPost$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiAccountsFindPost(params?: {
        body?: FinancialPortfolioSearchSearchOptions
    }): Observable<Array<AccountApiAccountResponse>> {

        return this.apiAccountsFindPost$Response(params).pipe(
            map((r: StrictHttpResponse<Array<AccountApiAccountResponse>>) => r.body as Array<AccountApiAccountResponse>)
        );
    }

    /**
     * Path part for operation apiAccountsIdGet
     */
    static readonly ApiAccountsIdGetPath = '/api/accounts/{id}';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiAccountsIdGet()` instead.
     *
     * This method doesn't expect any request body.
     */
    apiAccountsIdGet$Response(params: {
        id: string;
    }): Observable<StrictHttpResponse<AccountApiAccountResponse>> {

        const rb = new RequestBuilder(this.rootUrl, AccountsService.ApiAccountsIdGetPath, 'get');
        if (params) {
            rb.path('id', params.id, {});
        }

        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(
            filter((r: any) => r instanceof HttpResponse),
            map((r: HttpResponse<any>) => {
                return r as StrictHttpResponse<AccountApiAccountResponse>;
            })
        );
    }

    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiAccountsIdGet$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    apiAccountsIdGet(params: {
        id: string;
    }): Observable<AccountApiAccountResponse> {

        return this.apiAccountsIdGet$Response(params).pipe(
            map((r: StrictHttpResponse<AccountApiAccountResponse>) => r.body as AccountApiAccountResponse)
        );
    }

    /**
     * Path part for operation apiAccountsIdPut
     */
    static readonly ApiAccountsIdPutPath = '/api/accounts/{id}';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiAccountsIdPut()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiAccountsIdPut$Response(params: {
        id: string;
        body?: FinancialPortfolioApiGatewayContractsAccountsRequestsUpdateAccountRequest
    }): Observable<StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>> {

        const rb = new RequestBuilder(this.rootUrl, AccountsService.ApiAccountsIdPutPath, 'put');
        if (params) {
            rb.path('id', params.id, {});
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
     * To access the full response (for headers, for example), `apiAccountsIdPut$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiAccountsIdPut(params: {
        id: string;
        body?: FinancialPortfolioApiGatewayContractsAccountsRequestsUpdateAccountRequest
    }): Observable<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse> {

        return this.apiAccountsIdPut$Response(params).pipe(
            map((r: StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>) => r.body as FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse)
        );
    }

    /**
     * Path part for operation apiAccountsIdDelete
     */
    static readonly ApiAccountsIdDeletePath = '/api/accounts/{id}';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiAccountsIdDelete()` instead.
     *
     * This method doesn't expect any request body.
     */
    apiAccountsIdDelete$Response(params: {
        id: string;
    }): Observable<StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>> {

        const rb = new RequestBuilder(this.rootUrl, AccountsService.ApiAccountsIdDeletePath, 'delete');
        if (params) {
            rb.path('id', params.id, {});
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
     * To access the full response (for headers, for example), `apiAccountsIdDelete$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    apiAccountsIdDelete(params: {
        id: string;
    }): Observable<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse> {

        return this.apiAccountsIdDelete$Response(params).pipe(
            map((r: StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>) => r.body as FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse)
        );
    }

    /**
     * Path part for operation apiAccountsPost
     */
    static readonly ApiAccountsPostPath = '/api/accounts';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiAccountsPost()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiAccountsPost$Response(params?: {
        body?: FinancialPortfolioApiGatewayContractsAccountsRequestsCreateAccountRequest
    }): Observable<StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>> {

        const rb = new RequestBuilder(this.rootUrl, AccountsService.ApiAccountsPostPath, 'post');
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
     * To access the full response (for headers, for example), `apiAccountsPost$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiAccountsPost(params?: {
        body?: FinancialPortfolioApiGatewayContractsAccountsRequestsCreateAccountRequest
    }): Observable<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse> {

        return this.apiAccountsPost$Response(params).pipe(
            map((r: StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>) => r.body as FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse)
        );
    }

}
