import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

@Component({
    selector: 'app-category-charts',
    templateUrl: './category-charts.component.html',
    styleUrls: ['./category-charts.component.scss']
})
export class CategoryChartsComponent implements OnInit, OnDestroy {
    @Input()
    set categoryItem(category: CategoryResponse) {
        this.category = category;

        this.calculatePies();
    }

    category!: CategoryResponse;

    allocationsChart: { name: string, value: number }[] = [];
    isAllocationChartExist: boolean = true;

    expectedAllocationsChart: { name: string, value: number }[] = [];
    isExpectedllocationChartExist: boolean = true;

    pieOptions = {
        gradient: true,
        showLegend: false,
        showLabels: true,
        isDoughnut: false,
        legendPosition: LegendPosition.Below,
        colorScheme: "nightLights"
    };

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private categoryOrchestratorService: CategoryOrchestratorService) {
        this.categoryOrchestratorService.assetDeleted.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.calculatePies();
        });
        this.categoryOrchestratorService.assetUpdated.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.calculatePies();
        });
        this.categoryOrchestratorService.subCategoryDeleted.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.calculatePies();
        });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    calculatePies(): void {
        this.category.assets?.sort((a, b) => b.allocation - a.allocation);
        this.category.subCategories?.sort((a, b) => b.allocation - a.allocation);

        let pieData = this.categoryOrchestratorService.hasCategories(this.category) ? this.category.subCategories : this.category.assets;
        this.allocationsChart = pieData.map(category => ({ name: category.name, value: category.allocationInPercentage }));
        this.expectedAllocationsChart = pieData.map(category => ({ name: category.name, value: category.expectedAllocationInPercentage }));

        this.isAllocationChartExist = this.allocationsChart.filter(item => item.value != 0).length > 0;
        this.isExpectedllocationChartExist = this.expectedAllocationsChart.filter(item => item.value != 0).length > 0;
    }

    onSelect(data: any): void {
        if (this.category.subCategories.length == 0)
            return;

        let selectedCategory = this.category.subCategories.find(c => c.name == data.name) ?? null;
        this.categoryOrchestratorService.selectedCategory.next(selectedCategory);
    }
}
