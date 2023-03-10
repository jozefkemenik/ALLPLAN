import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsofuseComponent } from './termsofuse.component';
import { DialogTermsofuseComponent } from './dialog/dialog-termsofuse.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../../core/core.module';

export const routes: Routes = [
  { path: '', component: TermsofuseComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    TermsofuseComponent,
    DialogTermsofuseComponent 
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),
  ]
})
export class TermsofuseModule { }
