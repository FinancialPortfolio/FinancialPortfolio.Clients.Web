import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryListItemComponent } from './category-list-item/category-list-item.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryAddComponent } from './category-add/category-add.component';
import { StockAddComponent } from './stock-add/stock-add.component';

@NgModule({
    declarations: [
        CategoryListComponent,
        CategoryListItemComponent,
        CategoryAddComponent,
        StockAddComponent
    ],
    imports: [
        CommonModule,
        CategoriesRoutingModule,
        MatTreeModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxChartsModule
    ]
})
export class CategoriesModule { }
