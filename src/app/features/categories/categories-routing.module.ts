import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryOrchestratorComponent } from './category-orchestrator/category-orchestrator.component';
import { SaveCategoriesGuard } from './guards/save-categories.guard';

export const routes: Routes = [
    { path: '', component: CategoryOrchestratorComponent, canDeactivate: [SaveCategoriesGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [SaveCategoriesGuard]
})
export class CategoriesRoutingModule { }
