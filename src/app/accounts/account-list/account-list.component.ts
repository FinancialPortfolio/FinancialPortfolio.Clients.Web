import { Component, OnInit } from '@angular/core';
import { AccountResponse } from 'src/app/api/models/AccountApi/account-response';
import { AccountsService } from 'src/app/api/services';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
  accounts: AccountResponse[] = [];
  displayedColumns: string[] = ['name', 'description', 'createdDateTime'];
  
  constructor(private accountsService: AccountsService) { }

  ngOnInit(): void {
    this.accountsService.apiAccountsGet().subscribe(data => {
      console.log(data);
      this.accounts = data;
    })
  }

}
