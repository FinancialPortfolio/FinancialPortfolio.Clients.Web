import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { AuthCallbackComponent } from './authentication/auth-callback/auth-callback.component';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { AppRoutingModule } from './routing/app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ApiModule } from './api/api.module';
import { AuthenticationInterceptor } from './authentication/interceptors/authentication-interceptor';
import { AppReducers } from './store/app.reducers';
import { AccountsEffects } from './accounts/store/accounts.effects';
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        AuthCallbackComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule, // TODO: move to core
        CoreModule,
        HomeModule,
        AuthenticationModule,// TODO: move to core?
        AppRoutingModule, // TODO: move to core
        ApiModule.forRoot({ rootUrl: environment.gatewayUrl }),
        StoreModule.forRoot(AppReducers),
        StoreDevtoolsModule.instrument({
            maxAge: 25
        }),
        EffectsModule.forRoot([AccountsEffects])
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }, // TODO: move to core?
        { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } } // // TODO: move to core?
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
