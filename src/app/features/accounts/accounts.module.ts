import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountListComponent } from './account-list/account-list.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AccountAddComponent } from './account-add/account-add.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountIntegrateComponent } from './account-integrate/account-integrate.component';

@NgModule({
    declarations: [
        AccountListComponent,
        AccountAddComponent,
        AccountEditComponent,
        AccountIntegrateComponent
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
