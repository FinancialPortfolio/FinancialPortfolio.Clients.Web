import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

@Component({
    selector: 'app-sub-category-add',
    templateUrl: './sub-category-add.component.html',
    styleUrls: ['./sub-category-add.component.scss']
})
export class SubCategoryAddComponent implements OnInit {
    categoryForm!: UntypedFormGroup;
    category: CategoryResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private categoryOrchestratorService: CategoryOrchestratorService,
        private dialogRef: MatDialogRef<SubCategoryAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { category: CategoryResponse }) {
        this.category = data.category;
    }

    ngOnInit(): void {
        this.categoryForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(25)]],
            description: ['', [Validators.maxLength(150)]],
            expectedAllocationInPercentage: [3, [Validators.required, Validators.maxLength(50)]]
        });
    }

    onSave(): void {
        if (!this.categoryForm.valid)
            return;

        let subCategory = {
            name: this.categoryForm.get('name')?.value,
            description: this.categoryForm.get('description')?.value,
            allocation: 0,
            allocationInPercentage: 0,
            expectedAllocationInPercentage: this.categoryForm.get('expectedAllocationInPercentage')?.value,
            userId: "",
            id: "",
            assets: [],
            subCategories: [],
            isSelected: false,
            isPartiallySelected: false
        };
        this.category.subCategories.push(subCategory);

        this.categoryOrchestratorService.addSubCategory(subCategory);

        this.dialogRef.close();
    }
}
