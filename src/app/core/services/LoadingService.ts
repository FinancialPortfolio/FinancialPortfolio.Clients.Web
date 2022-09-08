import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { take } from "rxjs/operators";
import { LoadAccountsAction } from "src/app/features/accounts/store/accounts.actions";
import { AuthService } from "src/app/authentication/services/auth.service";
import { AppState } from "src/app/store/app.reducers";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    constructor(private authService: AuthService, private store: Store<AppState>) {
    }

    loadAccounts() {
        this.authService.isAuthenticatedSubject.subscribe(isAuthenticated => {
            if (!isAuthenticated)
                return;

            this.store.select(state => state.accounts.hasLoaded).pipe(take(1)).subscribe(
                (hasLoaded: boolean) => {
                    if (!hasLoaded)
                        this.store.dispatch(LoadAccountsAction());
                }
            );
        });
    }
}
