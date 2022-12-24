import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';

@Component({
    selector: 'app-sub-category-edit',
    templateUrl: './sub-category-edit.component.html',
    styleUrls: ['./sub-category-edit.component.scss']
})
export class SubCategoryEditComponent implements OnInit {
    categoryForm!: UntypedFormGroup;
    category: CategoryResponse; // TODO: maybe I need to remove it
    subCategory: CategoryResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dialogRef: MatDialogRef<SubCategoryEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { category: CategoryResponse, subCategory: CategoryResponse }) {
        this.category = data.category;
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

        // edit

        this.dialogRef.close();
    }
}
