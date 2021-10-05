import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  name: string = "";
  isAuthenticated: boolean = false;
  subscription:Subscription|undefined = undefined;

  constructor(private authService:AuthService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.subscription = this.authService.authNavStatus$.subscribe(status => this.isAuthenticated = status);
    this.name = this.authService.name;
  } 

  async login() {     
    await this.authService.login();
  }   

   async signout() {
    await this.authService.signout();     
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
