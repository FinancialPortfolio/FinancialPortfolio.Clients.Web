import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table'; 
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule, 
    NgxSpinnerModule,
    MatTableModule
  ],
  exports: [
    NgxSpinnerModule,
    MatTableModule
  ],
  providers: []
})
export class SharedModule { }
