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
   * Path part for operation apiAccountsGet
   */
  static readonly ApiAccountsGetPath = '/api/accounts';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAccountsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAccountsGet$Response(params?: {
  }): Observable<StrictHttpResponse<Array<AccountApiAccountResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.ApiAccountsGetPath, 'get');
    if (params) {
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
   * To access the full response (for headers, for example), `apiAccountsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAccountsGet(params?: {
  }): Observable<Array<AccountApiAccountResponse>> {

    return this.apiAccountsGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<AccountApiAccountResponse>>) => r.body as Array<AccountApiAccountResponse>)
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
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.ApiAccountsPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
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
  }): Observable<void> {

    return this.apiAccountsPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
