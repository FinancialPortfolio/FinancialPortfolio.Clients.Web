import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

import { CategoryResponse } from 'src/app/api/models/Categories/category-response';
import { GetStocksRequest } from 'src/app/api/models/Stocks/get-stocks-request';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { StockResponse } from 'src/app/api/models/Stocks/stock-response';
import { StocksService } from 'src/app/api/services/stocks.service';

@Component({
  selector: 'app-stock-add',
  templateUrl: './stock-add.component.html',
  styleUrls: ['./stock-add.component.scss']
})
export class StockAddComponent implements OnInit {
    stockForm!: UntypedFormGroup;
    category: CategoryResponse;

    isLoading = false;
    minLengthTerm = 3;
    debounceTime = 500;
    assets: StockResponse[] = [];
    asset: StockResponse | undefined;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dialogRef: MatDialogRef<CategoryAddComponent>,
        private stocksService: StocksService,
        @Inject(MAT_DIALOG_DATA) public data: { item: CategoryResponse }) {
        this.category = data.item;
    }

    ngOnInit(): void {
        this.stockForm = this.formBuilder.group({
            allocation: [3, [Validators.required, Validators.maxLength(50)]],
            asset: ['', [Validators.required]],
            assetId: ['', [Validators.required]]
        });

        this.initAutocomplete();
    }

    initAutocomplete(): void {
        this.stockForm.get('asset')?.valueChanges
            .pipe(
                filter(result => {
                    return result !== null && result.length >= this.minLengthTerm
                }),
                distinctUntilChanged(),
                debounceTime(this.debounceTime),
                tap(() => {
                    this.assets = [];
                    this.isLoading = true;
                }),
                switchMap(value => {
                    let request: GetStocksRequest = {
                        name: value,
                        symbol: null,
                        type: null,
                        pagination: null,
                        sorting: null
                    };
                    return this.stocksService.getAll(request)
                        .pipe(finalize(() => this.isLoading = false));
                })
            )
            .subscribe((result: any) => {
                this.assets = result.response;
            });
    }

    onSave(): void {
        if (!this.stockForm.valid || !this.asset)
            return;

        // this.category.stocks.push({
        //     allocation: this.stockForm.get('allocation')?.value,
        //     expectedAllocation: this.stockForm.get('allocation')?.value,
        //     name: this.asset.name,
        //     symbol: this.asset.symbol
        // });

        this.dialogRef.close();
    }

    clearSelection() {
        this.stockForm.get('asset')?.setValue("");
        this.stockForm.get('assetId')?.setValue("");
        this.assets = [];
    }

    onSelected(asset: StockResponse) {
        this.asset = asset;
        this.stockForm.get('asset')?.setValue(asset.name);
        this.stockForm.get('assetId')?.setValue(asset.id);
    }
}
