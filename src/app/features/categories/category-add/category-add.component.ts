import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';

@Component({
    selector: 'app-category-add',
    templateUrl: './category-add.component.html',
    styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit {
    categoryForm!: UntypedFormGroup;
    category: CategoryResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dialogRef: MatDialogRef<CategoryAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { item: CategoryResponse }) {
        this.category = data.item;
    }

    ngOnInit(): void {
        this.categoryForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(25)]],
            description: ['', [Validators.maxLength(150)]],
            allocation: [3, [Validators.required, Validators.maxLength(50)]]
        });
    }

    onSave(): void {
        if (!this.categoryForm.valid)
            return;

        // this.category.subCategories.push({
        //     allocation: this.categoryForm.get('allocation')?.value,
        //     expectedAllocationInPercentage: this.categoryForm.get('allocation')?.value,
        //     name: this.categoryForm.get('name')?.value,
        //     description: this.categoryForm.get('description')?.value,
        //     userId: "",
        //     id: "",
        //     assets: [],
        //     subCategories: []
        // });

        this.dialogRef.close();
    }
}
