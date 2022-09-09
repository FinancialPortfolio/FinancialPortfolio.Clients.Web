import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { AccountStockListComponent } from './account-stock-list/account-stock-list.component';
import { AccountStocksRoutingModule } from './account-stocks-routing.module';

@NgModule({
  declarations: [
    AccountStockListComponent
  ],
  imports: [
    CommonModule,
    AccountStocksRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class AccountStocksModule { }
