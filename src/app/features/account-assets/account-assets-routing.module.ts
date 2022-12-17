import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AccountAssetListComponent } from "./account-asset-list/account-asset-list.component";

export const routes: Routes = [
    { path: '', component: AccountAssetListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AccountAssetsRoutingModule { }
