import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../authentication/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() sidebarOpened = new EventEmitter();

    isAuthenticated: boolean = false;
    subscription: Subscription | undefined = undefined;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.subscription = this.authService.authNavStatus$.subscribe(status => this.isAuthenticated = status);
    }

    async login() {
        await this.authService.login();
    }

    async signout() {
        await this.authService.signout();
    }

    openSidebar() {
        this.sidebarOpened.emit();
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
}
