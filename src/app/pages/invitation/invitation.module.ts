import { NgModule } from '@angular/core';
import {InvitationComponent} from './invitation.component'
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../../core/core.module';


export const routes: Routes = [
  { path: '', component: InvitationComponent, pathMatch: 'full' }
]; 
@NgModule({
  declarations: [InvitationComponent],
  imports: [
    CoreModule,
    RouterModule.forChild(routes),
  ]
})
export class InvitationModule { }
