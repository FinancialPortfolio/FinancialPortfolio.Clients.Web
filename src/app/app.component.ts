import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AccountCreatedOperation, AccountDeletedOperation, AccountUpdatedOperation } from './core/models/operations';
import { SuccessfulOperation } from './core/models/successful-operation';

import { SignalrService } from './core/services/signalr.service';
import { AddAccountAction, DeleteAccountAction, UpdateAccountAction } from './features/accounts/store/accounts.actions';
import { AccountsState } from './features/accounts/store/accounts.reducers';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private signalrService: SignalrService, private store: Store<AccountsState>) {
    }

    ngOnInit(): void {
        this.signalrService.addOperationsListener();

        this.signalrService.operationSucceededSubject.subscribe((data: SuccessfulOperation) => {
            console.log(data);
            let action = null;
            if (data.name == AccountCreatedOperation)
                action = AddAccountAction({ account: data.payload });

            if (data.name == AccountUpdatedOperation)
                action = UpdateAccountAction({ account: data.payload });

            if (data.name == AccountDeletedOperation)
                action = DeleteAccountAction({ id: data.payload.id });

            if (action)
                this.store.dispatch(action);
        });
    }
}
