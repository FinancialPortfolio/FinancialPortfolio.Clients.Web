import { HttpClient } from '@angular/common/http';

import { ApiConfiguration } from './api-configuration';

export class ApiServiceBase {
    readonly apiEndpoint: string;

    constructor(protected config: ApiConfiguration, protected http: HttpClient, apiUrl: string) {
        this.apiEndpoint = `${config.rootUrl}${apiUrl}`;
    }
}
