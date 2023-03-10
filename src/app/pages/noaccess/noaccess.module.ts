import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoaccessComponent } from './noaccess/noaccess.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';


export const routes: Routes = [
  { path: '', component: NoaccessComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    NoaccessComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class NoaccessModule { }
