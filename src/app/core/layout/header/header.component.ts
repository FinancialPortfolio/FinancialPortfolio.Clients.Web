import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../../authentication/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() sidebarOpened = new EventEmitter();

    isAuthenticated: boolean = false;
    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authService.isAuthenticatedSubject.pipe(takeUntil(this.unsubscribe)).subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
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
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
