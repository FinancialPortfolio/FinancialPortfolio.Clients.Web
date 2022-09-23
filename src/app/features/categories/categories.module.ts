import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';

import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryListItemComponent } from './category-list-item/category-list-item.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
        CategoryListComponent,
        CategoryListItemComponent
    ],
    imports: [
        CommonModule,
        CategoriesRoutingModule,
        MatTreeModule,
        SharedModule
    ]
})
export class CategoriesModule { }
