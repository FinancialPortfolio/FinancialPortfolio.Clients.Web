import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

@Component({
    selector: 'app-category-charts',
    templateUrl: './category-charts.component.html',
    styleUrls: ['./category-charts.component.scss']
})
export class CategoryChartsComponent implements OnInit {
    @Input()
    set categoryItem(category: CategoryResponse) {
        this.category = category;

        this.isUncategorizedCategory = this.categoryOrchestratorService.isUncategorized(this.category);

        this.calculatePies();
    }

    category!: CategoryResponse;
    isUncategorizedCategory = false;

    allocationsChart: { name: string, value: number }[] = [];
    expectedAllocationsChart: { name: string, value: number }[] = [];

    pieOptions = {
        gradient: true,
        showLegend: false,
        showLabels: true,
        isDoughnut: false,
        legendPosition: LegendPosition.Below,
        colorScheme: "nightLights"
    };

    constructor(private categoryOrchestratorService: CategoryOrchestratorService) {
        this.categoryOrchestratorService.assetDeleted.subscribe(() => {
            this.calculatePies();
        });
        this.categoryOrchestratorService.subCategoryDeleted.subscribe(() => {
            this.calculatePies();
        });
    }

    ngOnInit(): void {
    }

    calculatePies(): void {
        this.category.assets?.sort((a, b) => b.allocation - a.allocation);
        this.category.subCategories?.sort((a, b) => b.allocation - a.allocation);

        let pieData = this.categoryOrchestratorService.hasCategories(this.category) ? this.category.subCategories : this.category.assets;
        this.allocationsChart = pieData.map(category => ({ name: category.name, value: category.allocationInPercentage }));
        this.expectedAllocationsChart = pieData.map(category => ({ name: category.name, value: category.expectedAllocationInPercentage }));

        this.isUncategorizedCategory = this.categoryOrchestratorService.isUncategorized(this.category);
    }

    onSelect(data: any): void {
        if (this.category.subCategories.length == 0)
            return;

        let selectedCategory = this.category.subCategories.find(c => c.name == data.name) ?? null;
        this.categoryOrchestratorService.selectedCategory.next(selectedCategory);
    }
}
