import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { CategoryResponse } from '../models/Categories/category-response';
import { WebApiResponse } from '../models/Shared/web-api-response';
import { ApiServiceBase } from '../api-base-service';
import { UpdateCategoryRequest } from '../models/Categories/update-category-request';
import { BaseWebApiResponse } from '../models/Shared/base-web-api-response';

@Injectable()
export class CategoriesService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '/categories');
    }

    getAll(): Observable<WebApiResponse<CategoryResponse>> {
        return this.http.get(this.apiEndpoint)
            .pipe(map((response: any) => response as WebApiResponse<CategoryResponse>));
    }

    update(request: UpdateCategoryRequest): Observable<BaseWebApiResponse> {
        return this.http.put(this.apiEndpoint, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }
}
