import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';

import { AppComponent } from './app.component';

import { AuthCallbackComponent } from './authentication/auth-callback/auth-callback.component';

import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { AppRoutingModule } from './routing/app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ApiModule } from './api/api.module';
import { AuthenticationInterceptor } from './authentication/interceptors/authentication-interceptor';
import { AppReducers } from './store/app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { AccountsEffects } from './accounts/store/accounts.effects';
import { TransfersEffects } from './transfers/store/transfers.effects';

@NgModule({
  declarations: [
    AppComponent,
    AuthCallbackComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    HomeModule,
    AuthenticationModule,
    AppRoutingModule,
    ApiModule.forRoot({ rootUrl: 'https://localhost:5001' }),
    StoreModule.forRoot(AppReducers),
    EffectsModule.forRoot([AccountsEffects, TransfersEffects])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
