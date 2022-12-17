import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { AccountAssetListComponent } from './account-asset-list/account-asset-list.component';
import { AccountAssetsRoutingModule } from './account-assets-routing.module';

@NgModule({
  declarations: [
    AccountAssetListComponent
  ],
  imports: [
    CommonModule,
    AccountAssetsRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class AccountAssetsModule { }
