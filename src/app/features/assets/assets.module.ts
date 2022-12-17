import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AssetListComponent } from './asset-list/asset-list.component';
import { SharedModule } from '../../shared/shared.module';
import { AssetsRoutingModule } from './assets-routing.module';

@NgModule({
  declarations: [
    AssetListComponent
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class AssetsModule { }
