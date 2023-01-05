import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DividendListComponent } from "./dividend-list/dividend-list.component";

export const routes: Routes = [
    { path: '', component: DividendListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class DividendsRoutingModule { }
