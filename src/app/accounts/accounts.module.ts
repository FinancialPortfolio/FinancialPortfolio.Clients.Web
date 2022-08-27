import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountListComponent } from './account-list/account-list.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AccountAddComponent } from './account-add/account-add.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AccountListComponent,
        AccountAddComponent,
        AccountEditComponent
    ],
    imports: [
        CommonModule,
        AccountsRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
        // TODO: add store for feature
    ]
})
export class AccountsModule { }
