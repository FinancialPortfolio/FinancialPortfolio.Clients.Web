import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TransferListComponent } from "./transfer-list/transfer-list.component";

export const routes: Routes = [
    { path: '', component: TransferListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class TransfersRoutingModule { }
