import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountResponse } from 'src/app/api/models/AccountApi/account-response';
import { AccountsService } from 'src/app/api/services';
import { AccountAddComponent } from '../account-add/account-add.component';
import { AccountEditComponent } from '../account-edit/account-edit.component';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
  accounts: AccountResponse[] = [];
  displayedColumns: string[] = ['name', 'description', 'createdDateTime', 'actions'];
  
  constructor(private accountsService: AccountsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.accountsService.apiAccountsGet().subscribe(data => {
      this.accounts = data;
    })
  }

  add(): void {
    this.dialog.open(AccountAddComponent, {
      width: '500px'
    });
  }

  edit(element: AccountResponse): void {
    this.dialog.open(AccountEditComponent, {
      width: '500px',
      data: { item: element }
    });
  }
}
