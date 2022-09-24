import { Component, Input } from '@angular/core';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { CategoryResponse } from 'src/app/api/models/Categories/category-response';

@Component({
    selector: 'app-category-list-item',
    templateUrl: './category-list-item.component.html',
    styleUrls: ['./category-list-item.component.scss']
})
export class CategoryListItemComponent {
    category!: CategoryResponse;
    @Input() set categoryItem(value: CategoryResponse) {
        this.category = value;

        let sortedCategories = this.category.subCategories.sort((a,b) => b.expectedAllocation - a.expectedAllocation)

        this.categoryAllocations = sortedCategories.map(category => ({ name: category.name, value: category.allocation }));
        this.categoryExpectedAllocations = sortedCategories.map(category => ({ name: category.name, value: category.expectedAllocation }));
    }

    categoryAllocations: {name: string, value: number}[] = [];
    categoryExpectedAllocations: {name: string, value: number}[] = [];

    pieOptions = {
        gradient: true,
        showLegend: false,
        showLabels: true,
        isDoughnut: false,
        legendPosition: LegendPosition.Below,
        colorScheme: {
            name: "Default",
            group: ScaleType.Linear,
            selectable: false,
            domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
        }
    };
}
