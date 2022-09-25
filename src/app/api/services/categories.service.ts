import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';

import { ApiConfiguration } from '../api-configuration';
import { CategoryResponse } from '../models/Categories/category-response';
import { WebApiResponse } from '../models/Shared/web-api-response';
import { ApiServiceBase } from '../api-base-service';
import { HttpStatusCode } from '../models/Shared/http-status-code';

@Injectable()
export class CategoriesService extends ApiServiceBase {
    categoryResponse: WebApiResponse<Array<CategoryResponse>> = {
        statusCode: HttpStatusCode.Ok,
        response: [
            {
                allocation: 50,
                expectedAllocation: 50,
                name: "Stocks",
                description: "",
                userId: "",
                id: "",
                stocks: [],
                subCategories: [
                    {
                        allocation: 20,
                        expectedAllocation: 20,
                        name: "Financials",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: [
                            {
                                allocation: 75,
                                expectedAllocation: 75,
                                name: "Banks",
                                description: "",
                                userId: "",
                                id: "",
                                stocks: [
                                    {
                                        id: "",
                                        allocation: 3,
                                        exchange: "US",
                                        name: "JPMorgan",
                                        symbol: "JPM",
                                        expectedAllocation: 3
                                    },
                                    {
                                        id: "",
                                        allocation: 3,
                                        exchange: "US",
                                        name: "Morgan Stanley",
                                        symbol: "MS",
                                        expectedAllocation: 3
                                    },
                                    {
                                        id: "",
                                        allocation: 3,
                                        exchange: "US",
                                        name: "Brookfield Asset Management",
                                        symbol: "BAM",
                                        expectedAllocation: 3
                                    },
                                    {
                                        id: "",
                                        allocation: 3,
                                        exchange: "US",
                                        name: "Royal Bank of Canada",
                                        symbol: "RY",
                                        expectedAllocation: 3
                                    },
                                    {
                                        id: "",
                                        allocation: 3,
                                        exchange: "US",
                                        name: "Bank of America",
                                        symbol: "BAC",
                                        expectedAllocation: 3
                                    }
                                ],
                                subCategories: []
                            },
                            {
                                allocation: 25,
                                expectedAllocation: 25,
                                name: "Other",
                                description: "",
                                userId: "",
                                id: "",
                                stocks: [],
                                subCategories: []
                            }
                        ]
                    },
                    {
                        allocation: 30,
                        expectedAllocation: 30,
                        name: "Information Technology",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    },
                    {
                        allocation: 30,
                        expectedAllocation: 30,
                        name: "Consumer",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    },
                    {
                        allocation: 15,
                        expectedAllocation: 15,
                        name: "Manufacturing",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    },
                    {
                        allocation: 3,
                        expectedAllocation: 3,
                        name: "Health Care",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    },
                    {
                        allocation: 2,
                        expectedAllocation: 2,
                        name: "Real estate",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    }
                ]
            },
            {
                allocation: 50,
                expectedAllocation: 50,
                name: "ETFs",
                description: "",
                userId: "",
                id: "",
                stocks: [],
                subCategories: [
                    {
                        allocation: 50,
                        expectedAllocation: 50,
                        name: "USA",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    },
                    {
                        allocation: 10,
                        expectedAllocation: 10,
                        name: "Other countries",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    },
                    {
                        allocation: 20,
                        expectedAllocation: 20,
                        name: "Dividend",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    },
                    {
                        allocation: 5,
                        expectedAllocation: 5,
                        name: "Real estate",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    },
                    {
                        allocation: 5,
                        expectedAllocation: 5,
                        name: "Energy",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    },
                    {
                        allocation: 5,
                        expectedAllocation: 5,
                        name: "Financial",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    },
                    {
                        allocation: 5,
                        expectedAllocation: 5,
                        name: "Healthcare",
                        description: "",
                        userId: "",
                        id: "",
                        stocks: [],
                        subCategories: []
                    }
                ]
            }
        ]
    };

    selectedCategory = new Subject<CategoryResponse>();

    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '/categories');
    }

    getAll(): Observable<WebApiResponse<Array<CategoryResponse>>> {
        return of(this.categoryResponse);
    }
}
