/* tslint:disable */
/* eslint-disable */
import { HttpStatusCode as SystemNetHttpStatusCode } from '../../../../System/Net/http-status-code';
export interface WebApiProblemDetails {
  detail?: null | string;
  errors?: null | {
[key: string]: Array<string>;
};
  statusCode?: SystemNetHttpStatusCode;
  title?: null | string;
}
