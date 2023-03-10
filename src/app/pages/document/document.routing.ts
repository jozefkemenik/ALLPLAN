import { NgModule } from '@angular/core';
import { Routes, RouterModule, ROUTES, Router } from '@angular/router';
import { ListComponent } from './pages/list/list.component'

@NgModule({
  exports: [RouterModule],
  providers: [{
    provide: ROUTES,
    useFactory: setRoutesBasedOnUrl,
    multi: true
  }]
})
export class DocumentRoutingModule { }

function setRoutesBasedOnUrl(router:Router) {
  return [
    {
      path: '',
      component: ListComponent, data: {
        breadcrumb: 'expansionPanel',

      }
    },
    {
      path: ':projectId',
      component: ListComponent, data: {
        breadcrumb: '_companyId', title: 'Company',
      },
    }
  ]
}


