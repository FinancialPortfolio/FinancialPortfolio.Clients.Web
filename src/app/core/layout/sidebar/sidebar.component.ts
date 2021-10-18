import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountSelectorComponent } from '../../account-selector/account-selector.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() sidebarClosed = new EventEmitter();

  constructor(private dialog: MatDialog) {
  }

  closeSidebar() {
    this.sidebarClosed.emit();
  }

  selectAccount() {
    this.dialog.open(AccountSelectorComponent, {
      width: '350px'
    });
  }
}
