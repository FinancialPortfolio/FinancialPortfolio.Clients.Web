import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';
import { AccountsService } from './services/accounts.service';
import { StocksService } from './services/stocks.service';
import { TransfersService } from './services/transfers.service';
import { OrdersService } from './services/orders.service';
import { HttpErrorInterceptor } from './interceptors/HttpErrorInterceptor';
import { AccountStocksService } from './services/account-stocks.service';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        AccountsService,
        StocksService,
        AccountStocksService,
        TransfersService,
        OrdersService,
        ApiConfiguration,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        }
    ],
})
export class ApiModule {
    static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [
                {
                    provide: ApiConfiguration,
                    useValue: params
                }
            ]
        }
    }

    constructor(
        @Optional() @SkipSelf() parentModule: ApiModule,
        @Optional() http: HttpClient
    ) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
                'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
