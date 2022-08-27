import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-auth-callback',
    templateUrl: './auth-callback.component.html',
    styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

    error: boolean = false;

    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

    async ngOnInit() {
        let fragment = this.route.snapshot.fragment;
        if (fragment != null && fragment.indexOf('error') >= 0) {
            this.error = true;
            return;
        }

        await this.authService.completeAuthentication();
        this.router.navigate(['/home']);
    }
}
