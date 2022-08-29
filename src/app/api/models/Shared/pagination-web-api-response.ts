import { WebApiResponse } from './web-api-response';

export interface PaginationWebApiResponse<T> extends WebApiResponse<T> {
    totalCount: number;
}
