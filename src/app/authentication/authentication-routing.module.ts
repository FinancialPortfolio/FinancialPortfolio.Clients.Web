import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthCallbackComponent } from "./auth-callback/auth-callback.component";

export const routes: Routes = [
    { path: '', redirectTo: '/auth-callback', pathMatch: 'full' },
    { path: 'auth-callback', component: AuthCallbackComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
  })
  export class AuthenticationRoutingModule { }