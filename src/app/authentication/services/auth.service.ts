import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authenticatedSubject = new BehaviorSubject<boolean>(false);

    private manager = new UserManager(getClientSettings());
    private user: User | null = null;

    constructor(private http: HttpClient) {
        this.manager.getUser().then((user: any) => {
            this.user = user;
            this.authenticatedSubject.next(this.isAuthenticated());
        });
    }

    login() {
        return this.manager.signinRedirect();
    }

    async completeAuthentication() {
        this.user = await this.manager.signinRedirectCallback();
        this.authenticatedSubject.next(this.isAuthenticated());
    }

    isAuthenticated(): boolean {
        return this.user != null && !this.user.expired;
    }

    get authorizationHeaderValue(): string {
        return `${this.user?.token_type} ${this.user?.access_token}`;
    }

    get email(): string {
        return this.user?.profile?.Email != null ? this.user.profile.Email : '';
    }

    async signout() {
        await this.manager.signoutRedirect();
    }
}

export function getClientSettings(): UserManagerSettings {
    return {
        authority: environment.authority,
        client_id: 'FP_web_client',
        redirect_uri: `${environment.clientUrl}/auth-callback`,
        post_logout_redirect_uri: `${environment.clientUrl}`,
        response_type: "code",
        scope: "openid profile FPGateway",
        filterProtocolClaims: true,
        loadUserInfo: true,
        automaticSilentRenew: true,
        silent_redirect_uri: `${environment.clientUrl}/silent-refresh.html`
    };
}
