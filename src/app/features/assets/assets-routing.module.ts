import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AssetListComponent } from "./asset-list/asset-list.component";

export const routes: Routes = [
    { path: '', component: AssetListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AssetsRoutingModule { }
