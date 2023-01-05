import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DividendListComponent } from './dividend-list/dividend-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DividendsRoutingModule } from './dividend-routing.module';

@NgModule({
    declarations: [
        DividendListComponent
    ],
    imports: [
        CommonModule,
        DividendsRoutingModule,
        SharedModule,
        FormsModule
    ]
})
export class DividendsModule { }
