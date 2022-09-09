import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AccountStockListComponent } from "./account-stock-list/account-stock-list.component";

export const routes: Routes = [
    { path: '', component: AccountStockListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AccountStocksRoutingModule { }
