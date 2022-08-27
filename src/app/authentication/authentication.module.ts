import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
    declarations: [],
    providers: [
        AuthService,
        AuthGuard
    ],
    imports: [
        CommonModule,
        AuthenticationRoutingModule
    ]
})
export class AuthenticationModule { }
