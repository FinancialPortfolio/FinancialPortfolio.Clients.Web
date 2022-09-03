import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockListComponent } from './stock-list/stock-list.component';
import { SharedModule } from '../shared/shared.module';
import { StocksRoutingModule } from './stocks-routing.module';

@NgModule({
  declarations: [
    StockListComponent
  ],
  imports: [
    CommonModule,
    StocksRoutingModule,
    SharedModule
  ]
})
export class StocksModule { }
