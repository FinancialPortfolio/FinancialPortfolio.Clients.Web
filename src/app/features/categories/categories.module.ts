import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CategoryOrchestratorComponent } from './category-orchestrator/category-orchestrator.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubCategoryAddComponent } from './action-components/sub-category-add/sub-category-add.component';
import { AssetAddComponent } from './action-components/asset-add/asset-add.component';
import { AssetEditComponent } from './action-components/asset-edit/asset-edit.component';
import { SubCategoryEditComponent } from './action-components/sub-category-edit/sub-category-edit.component';
import { CategoryTreeComponent } from './category-tree/category-tree.component';
import { CategoryItemComponent } from './category-item-components/category-item/category-item.component';
import { CategoryAssetItemComponent } from './category-item-components/category-asset-item/category-asset-item.component';
import { CategorySubCategoryItemComponent } from './category-item-components/category-sub-category-item/category-sub-category-item.component';
import { CategoryChartsComponent } from './category-item-components/category-charts/category-charts.component';
import { CategorySelectorComponent } from './asset-comparison-components/category-selector/category-selector.component';
import { AssetComparisonComponent } from './asset-comparison-components/asset-comparison/asset-comparison.component';

@NgModule({
    declarations: [
        CategoryOrchestratorComponent,
        SubCategoryAddComponent,
        AssetAddComponent,
        AssetEditComponent,
        SubCategoryEditComponent,
        CategoryTreeComponent,
        CategoryItemComponent,
        CategoryAssetItemComponent,
        CategorySubCategoryItemComponent,
        CategoryChartsComponent,
        CategorySelectorComponent,
        AssetComparisonComponent
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
