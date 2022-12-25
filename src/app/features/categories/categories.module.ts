import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CategoryOrchestratorComponent } from './category-orchestrator/category-orchestrator.component';
import { CategorySubCategoryItemComponent } from './category-sub-category-item/category-sub-category-item.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubCategoryAddComponent } from './actions/sub-category-add/sub-category-add.component';
import { AssetAddComponent } from './actions/asset-add/asset-add.component';
import { AssetEditComponent } from './actions/asset-edit/asset-edit.component';
import { SubCategoryEditComponent } from './actions/sub-category-edit/sub-category-edit.component';
import { CategoryTreeComponent } from './category-tree/category-tree.component';

@NgModule({
    declarations: [
        CategoryOrchestratorComponent,
        CategorySubCategoryItemComponent,
        SubCategoryAddComponent,
        AssetAddComponent,
        AssetEditComponent,
        SubCategoryEditComponent,
        CategoryTreeComponent
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
