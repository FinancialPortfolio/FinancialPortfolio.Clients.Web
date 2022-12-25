import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryListComponent } from './category-list/category-list.component';
import { SaveCategoriesGuard } from './guards/save-categories.guard';

export const routes: Routes = [
    { path: '', component: CategoryListComponent, canDeactivate: [SaveCategoriesGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [SaveCategoriesGuard]
})
export class CategoriesRoutingModule { }
