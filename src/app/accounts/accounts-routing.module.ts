import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AccountListComponent } from "./account-list/account-list.component";

export const routes: Routes = [
    { path: '', component: AccountListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AccountsRoutingModule { }