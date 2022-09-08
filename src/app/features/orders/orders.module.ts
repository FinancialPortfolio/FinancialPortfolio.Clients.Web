import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { OrderAddComponent } from './order-add/order-add.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrdersRoutingModule } from './order-routing.module';

@NgModule({
    declarations: [
        OrderAddComponent,
        OrderEditComponent,
        OrderListComponent
    ],
    imports: [
        CommonModule,
        OrdersRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class OrdersModule { }
