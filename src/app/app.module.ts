import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';

import { AuthCallbackComponent } from './authentication/auth-callback/auth-callback.component';

import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { AppRoutingModule } from './routing/app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ApiModule } from './api/api.module';
import { AuthenticationInterceptor } from './authentication/interceptors/authentication-interceptor';
import { AppReducers } from './reducers/app.reducers';

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
    StoreModule.forRoot(AppReducers)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
