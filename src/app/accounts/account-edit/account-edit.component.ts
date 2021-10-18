import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountResponse } from 'src/app/api/models/AccountApi/account-response';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {
  accountForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {item: AccountResponse}) { }

  ngOnInit(): void {
    this.accountForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      description: ['', [Validators.required, Validators.maxLength(50)]]
    });

    this.accountForm.patchValue(this.data.item);
  }

  onSave(): void {
    if (!this.accountForm.valid)
      return;

    alert("Add after implementing on back end");
  }
}
