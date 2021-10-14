import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { AuthCallbackComponent } from './authentication/auth-callback/auth-callback.component';

import { CoreModule } from './core/core.module';
import { HomeModule }  from './home/home.module';
import { SharedModule }   from './shared/shared.module';
import { AppRoutingModule } from './routing/app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';

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
    SharedModule    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
