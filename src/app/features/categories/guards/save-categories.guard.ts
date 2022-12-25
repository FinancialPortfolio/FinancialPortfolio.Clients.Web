import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryAllocationService } from '../services/category-allocation.service';

@Injectable()
export class SaveCategoriesGuard implements CanDeactivate<CategoryListComponent> {

    constructor(private categoryAllocationService: CategoryAllocationService) { }

    canDeactivate(
        component: CategoryListComponent, // TODO: try remove this
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
      ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
        return !this.categoryAllocationService.isChanged;
      }
}
