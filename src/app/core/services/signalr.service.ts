import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Subject } from 'rxjs';

import { AuthService } from 'src/app/authentication/services/auth.service';
import { environment } from 'src/environments/environment';
import { FailedOperation } from '../models/failed-operation';
import { SuccessfulOperation } from '../models/successful-operation';

@Injectable({
    providedIn: 'root'
})
export class SignalrService {
    private hubConnection: HubConnection;

    public operationSucceededSubject = new Subject<SuccessfulOperation>();
    public operationFailedSubject = new Subject<FailedOperation>();

    constructor(private authService: AuthService) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(environment.operationsUrl)
            .build();

        this.hubConnection
            .start()
            .then(() => {
                this.joinGroup();
            })
            .catch(err => console.log('Error while starting connection: ' + err));

        this.authService.isAuthenticatedSubject.subscribe(isAuthenticated => {
            if (!isAuthenticated)
                return;

            this.joinGroup();
        });
    }

    public joinGroup(): void {
        if (this.hubConnection.state != HubConnectionState.Connected)
            return;

        if (!this.authService.isAuthenticated)
            return;

        this.hubConnection.send('JoinGroupAsync', this.authService.userId);
    }

    public addOperationsListener(): void {
        this.hubConnection.on('OperationSucceeded', (operation: SuccessfulOperation) => {
            console.log(operation);
            this.operationSucceededSubject.next(operation);
        });

        this.hubConnection.on('OperationFailed', (operation: FailedOperation) => {
            console.log(operation);
            this.operationFailedSubject.next(operation);
        });
    }
}
