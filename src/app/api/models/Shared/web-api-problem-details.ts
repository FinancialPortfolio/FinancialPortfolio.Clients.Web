import { HttpStatusCode } from './http-status-code';

export interface WebApiProblemDetails {
    statusCode: HttpStatusCode;
    title: string;
    detail: string;
    errors?: null | { [key: string]: Array<string> };
}
