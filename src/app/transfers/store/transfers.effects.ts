import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, filter, switchMap, map } from 'rxjs/operators';
import { WebApiResponse } from 'src/app/api/models/FinancialPortfolio/Infrastructure/WebApi/Models/Response/web-api-response';
import { TransferResponse } from 'src/app/api/models/TransferApi/transfer-response';

import { TransfersService } from "src/app/api/services";
import { LOAD_TRANSFERS, SetTransfersAction } from './transfers.actions';
import { TransfersState } from './transfers.reducers';

@Injectable()
export class TransfersEffects {
    constructor(
        private actions$: Actions,
        private store: Store<TransfersState>,
        private transfersService: TransfersService) {
    }

    loadTransfers = createEffect(() => this.actions$.pipe(
        ofType(LOAD_TRANSFERS),
        withLatestFrom(this.store),
        filter(([_, state]) => !state.hasLoaded),
        switchMap(() =>
            this.transfersService.apiTransfersGet().pipe(
                map((response: any) => SetTransfersAction({ transfers: response.response }))
            )
        )
        // TODO: add error handling here
    ));
}
