import { Component, Input, OnInit } from '@angular/core';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoriesService } from 'src/app/api/services/categories.service';

@Component({
    selector: 'app-category-list-item',
    templateUrl: './category-list-item.component.html',
    styleUrls: ['./category-list-item.component.scss']
})
export class CategoryListItemComponent implements OnInit {
    @Input()
    category!: CategoryResponse;
    displayedColumns: string[] = ['type', 'price', 'amount', 'total', 'dateTime', 'commission'];

    constructor(private categoriesService: CategoriesService) { }

    ngOnInit(): void {
    }

    onSelect() {
        this.categoriesService.selectedCategory.next(this.category);
    }

}
