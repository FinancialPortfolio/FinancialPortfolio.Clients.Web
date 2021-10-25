import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { TransferResponse } from 'src/app/api/models/TransferApi/transfer-response';
import { TransferType } from 'src/app/api/models/TransferApi/transfer-type';
import { AppState } from 'src/app/store/app.reducers';
import { LoadTransfersAction } from '../store/transfers.actions';
import { TransferAddComponent } from '../transfer-add/transfer-add.component';
import { TransferEditComponent } from '../transfer-edit/transfer-edit.component';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit {
  transfers: TransferResponse[] = [];
  displayedColumns: string[] = ['amount', 'dateTime', 'type', 'actions'];
  TransferType = TransferType;

  private readonly unsubscribe: Subject<void> = new Subject();

  constructor(private dialog: MatDialog, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(state => state.transfers.hasLoaded).pipe(take(1)).subscribe(
      (hasLoaded: boolean) => {
        if (!hasLoaded)
          this.store.dispatch(LoadTransfersAction());
      }
    );
    this.store.pipe(takeUntil(this.unsubscribe)).subscribe(
      (state: AppState) => {
        this.transfers = state.transfers.transfers;
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  add(): void {
    this.dialog.open(TransferAddComponent, {
      width: '500px'
    });
  }

  edit(element: TransferResponse): void {
    this.dialog.open(TransferEditComponent, {
      width: '500px',
      data: { item: element }
    });
  }
}
