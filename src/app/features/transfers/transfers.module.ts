import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { TransferAddComponent } from './transfer-add/transfer-add.component';
import { TransferEditComponent } from './transfer-edit/transfer-edit.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';
import { TransfersRoutingModule } from './transfer-routing.module';

@NgModule({
    declarations: [
        TransferAddComponent,
        TransferEditComponent,
        TransferListComponent
    ],
    imports: [
        CommonModule,
        TransfersRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class TransfersModule { }
