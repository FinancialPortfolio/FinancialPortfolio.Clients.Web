import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { selectSelectedAccount } from 'src/app/accounts/store/accounts.selectors';
import { CreateTransferRequest } from 'src/app/api/models/FinancialPortfolio/APIGateway/Contracts/Equity/Requests/create-transfer-request';
import { TransfersService } from 'src/app/api/services';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-transfer-add',
  templateUrl: './transfer-add.component.html',
  styleUrls: ['./transfer-add.component.scss']
})
export class TransferAddComponent implements OnInit, OnDestroy {
  transferForm!: FormGroup;
  accountId: string | undefined | null;
  
  private readonly unsubscribe: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private transfersService: TransfersService,
    private dialogRef: MatDialogRef<TransferAddComponent>,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.transferForm = this.formBuilder.group({
      amount: [0, [Validators.required]],
      type: ['Deposit', [Validators.required]]
    });

    this.store.select(selectSelectedAccount).pipe(takeUntil(this.unsubscribe)).subscribe(
      (selectedAccount) => {
        this.accountId = selectedAccount?.id;
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSave(): void {
    if (!this.transferForm.valid)
      return;

    let body: CreateTransferRequest = {
      ...this.transferForm.value,
      accountId: this.accountId
    };
    this.transfersService.apiTransfersPost$Response({ body })
      .subscribe(
        (result) => {
          console.log(result);
          // TODO: add to store on saved event
          // TODO: add toastr
          this.dialogRef.close();
        }, (error) => {
          console.log(error);
          // TODO: add toastr
          this.dialogRef.close();
        },
      );
  }
}
