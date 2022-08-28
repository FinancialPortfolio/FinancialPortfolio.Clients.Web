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

import { AssetResponse as AssetApiAssetResponse } from '../models/AssetApi/asset-response';
import { CreateAssetRequest as FinancialPortfolioApiGatewayContractsAssetsRequestsCreateAssetRequest } from '../models/FinancialPortfolio/APIGateway/Contracts/Assets/Requests/create-asset-request';
import { WebApiResponse as FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse } from '../models/FinancialPortfolio/Infrastructure/WebApi/Models/Response/web-api-response';
import { SearchOptions as FinancialPortfolioSearchSearchOptions } from '../models/FinancialPortfolio/Search/search-options';

@Injectable({
    providedIn: 'root',
})
export class AssetsService extends BaseService {
    constructor(
        config: ApiConfiguration,
        http: HttpClient
    ) {
        super(config, http);
    }

    /**
     * Path part for operation apiAssetsFindPost
     */
    static readonly ApiAssetsFindPostPath = '/api/assets/find';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiAssetsFindPost()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiAssetsFindPost$Response(params?: {
        body?: FinancialPortfolioSearchSearchOptions
    }): Observable<StrictHttpResponse<Array<AssetApiAssetResponse>>> {

        const rb = new RequestBuilder(this.rootUrl, AssetsService.ApiAssetsFindPostPath, 'post');
        if (params) {
            rb.body(params.body, 'application/*+json');
        }

        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(
            filter((r: any) => r instanceof HttpResponse),
            map((r: HttpResponse<any>) => {
                return r as StrictHttpResponse<Array<AssetApiAssetResponse>>;
            })
        );
    }

    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiAssetsFindPost$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiAssetsFindPost(params?: {
        body?: FinancialPortfolioSearchSearchOptions
    }): Observable<Array<AssetApiAssetResponse>> {

        return this.apiAssetsFindPost$Response(params).pipe(
            map((r: StrictHttpResponse<Array<AssetApiAssetResponse>>) => r.body as Array<AssetApiAssetResponse>)
        );
    }

    /**
     * Path part for operation apiAssetsIdGet
     */
    static readonly ApiAssetsIdGetPath = '/api/assets/{id}';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiAssetsIdGet()` instead.
     *
     * This method doesn't expect any request body.
     */
    apiAssetsIdGet$Response(params: {
        id: string;
    }): Observable<StrictHttpResponse<AssetApiAssetResponse>> {

        const rb = new RequestBuilder(this.rootUrl, AssetsService.ApiAssetsIdGetPath, 'get');
        if (params) {
            rb.path('id', params.id, {});
        }

        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(
            filter((r: any) => r instanceof HttpResponse),
            map((r: HttpResponse<any>) => {
                return r as StrictHttpResponse<AssetApiAssetResponse>;
            })
        );
    }

    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiAssetsIdGet$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    apiAssetsIdGet(params: {
        id: string;
    }): Observable<AssetApiAssetResponse> {

        return this.apiAssetsIdGet$Response(params).pipe(
            map((r: StrictHttpResponse<AssetApiAssetResponse>) => r.body as AssetApiAssetResponse)
        );
    }

    /**
     * Path part for operation apiAssetsPost
     */
    static readonly ApiAssetsPostPath = '/api/assets';

    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiAssetsPost()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiAssetsPost$Response(params?: {
        body?: FinancialPortfolioApiGatewayContractsAssetsRequestsCreateAssetRequest
    }): Observable<StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>> {

        const rb = new RequestBuilder(this.rootUrl, AssetsService.ApiAssetsPostPath, 'post');
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
     * To access the full response (for headers, for example), `apiAssetsPost$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    apiAssetsPost(params?: {
        body?: FinancialPortfolioApiGatewayContractsAssetsRequestsCreateAssetRequest
    }): Observable<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse> {

        return this.apiAssetsPost$Response(params).pipe(
            map((r: StrictHttpResponse<FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse>) => r.body as FinancialPortfolioInfrastructureWebApiModelsResponseWebApiResponse)
        );
    }

}
