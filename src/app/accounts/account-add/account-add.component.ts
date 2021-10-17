import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-account-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.scss']
})
export class AccountAddComponent implements OnInit {
  @ViewChild('form') form!: NgForm;

  constructor() { }

  ngOnInit(): void {
  }

  onSave(): void {

  }
}
