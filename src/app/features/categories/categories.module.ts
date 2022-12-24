import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryListItemComponent } from './category-list-item/category-list-item.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubCategoryAddComponent } from './actions/sub-category-add/sub-category-add.component';
import { AssetAddComponent } from './actions/asset-add/asset-add.component';
import { AssetEditComponent } from './actions/asset-edit/asset-edit.component';
import { SubCategoryEditComponent } from './actions/sub-category-edit/sub-category-edit.component';

@NgModule({
    declarations: [
        CategoryListComponent,
        CategoryListItemComponent,
        SubCategoryAddComponent,
        AssetAddComponent,
        AssetEditComponent,
        SubCategoryEditComponent
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
