import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AccountAddComponent } from "./account-add/account-add.component";
import { AccountEditComponent } from "./account-edit/account-edit.component";
import { AccountListComponent } from "./account-list/account-list.component";

export const routes: Routes = [
    { path: '', component: AccountListComponent },
    { path: 'add', component: AccountAddComponent },
    { path: 'edit/:id', component: AccountEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AccountsRoutingModule { }