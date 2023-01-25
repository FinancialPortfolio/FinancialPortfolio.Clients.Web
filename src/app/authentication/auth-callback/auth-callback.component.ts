import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-auth-callback',
    templateUrl: './auth-callback.component.html',
    styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

    async ngOnInit() {
        if (this.route.snapshot.queryParams?.error == null)
            await this.authService.completeAuthentication();

        this.router.navigate(['/home']);
    }
}
