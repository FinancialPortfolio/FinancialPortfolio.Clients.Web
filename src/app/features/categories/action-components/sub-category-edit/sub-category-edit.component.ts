import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { CategoryOrchestratorService } from '../../services/category-orchestrator.service';

@Component({
    selector: 'app-sub-category-edit',
    templateUrl: './sub-category-edit.component.html',
    styleUrls: ['./sub-category-edit.component.scss']
})
export class SubCategoryEditComponent implements OnInit {
    categoryForm!: UntypedFormGroup;
    subCategory: CategoryResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dialogRef: MatDialogRef<SubCategoryEditComponent>,
        private categoryOrchestratorService: CategoryOrchestratorService,
        @Inject(MAT_DIALOG_DATA) public data: { subCategory: CategoryResponse }) {
        this.subCategory = data.subCategory;
    }

    ngOnInit(): void {
        this.categoryForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(25)]],
            description: ['', [Validators.maxLength(150)]],
            expectedAllocationInPercentage: [3, [Validators.required, Validators.maxLength(50)]]
        });

        this.categoryForm.patchValue(this.subCategory);
    }

    onSave(): void {
        if (!this.categoryForm.valid)
            return;

        this.subCategory.name = this.categoryForm.get('name')?.value;
        this.subCategory.description = this.categoryForm.get('description')?.value;
        this.subCategory.expectedAllocationInPercentage = this.categoryForm.get('expectedAllocationInPercentage')?.value;

        this.categoryOrchestratorService.updateSubCategory(this.subCategory);

        this.dialogRef.close();
    }
}
