import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './pages/detail/detail.component';
import { CreateComponent } from './pages/create/create.component';

let routes: Routes= [

  { path: '',   redirectTo: '/companies', pathMatch: 'full' }, 
  {
    path: ':_idCompany',
    component: DetailComponent,
    data: {
      breadcrumb: '_idCompany',
    } 
  },
  {
    path: 'create',
    component: CreateComponent,
    data: {
      breadcrumb: 'Create',
    }
  }]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  
})
export class CompanyRoutingModule { }







  
