import { BaseWebApiResponse } from './base-web-api-response';

export interface WebApiResponse<T> extends BaseWebApiResponse {
    response: T;
}
