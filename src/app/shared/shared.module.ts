import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
 
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports:      [CommonModule, NgxSpinnerModule],
  exports:      [NgxSpinnerModule],
  providers:    []
})
export class SharedModule { }
