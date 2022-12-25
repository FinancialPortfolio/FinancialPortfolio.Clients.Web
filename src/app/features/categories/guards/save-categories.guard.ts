import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationService } from 'src/app/core/services/notification.service';
import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryCalculationService } from '../services/category-calculation.service';

@Injectable()
export class SaveCategoriesGuard implements CanDeactivate<CategoryListComponent> {

    constructor(private categoryAllocationService: CategoryCalculationService, private notificationService: NotificationService) { }

    canDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.categoryAllocationService.hasChanges ?
            this.notificationService.confirm("Confirm action", "You have unsaved changes. Do you want to stay on the page to save changes?").pipe(map(result => !result)) :
            true;
    }
}
