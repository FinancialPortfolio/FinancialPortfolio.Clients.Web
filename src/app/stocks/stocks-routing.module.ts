import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StockListComponent } from "./stock-list/stock-list.component";

export const routes: Routes = [
    { path: '', component: StockListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class StocksRoutingModule { }
