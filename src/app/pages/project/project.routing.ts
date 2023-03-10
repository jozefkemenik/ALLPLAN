import { NgModule } from '@angular/core';
import { RouterModule, ROUTES, Router } from '@angular/router';
import { DetailComponent } from './pages/detail/detail.component';
import { ListComponent } from './pages/list/list.component';
import { RevisionComponent } from './pages/detail/tabs/documents/pages/revision/revision.component';

var routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: ':_idCompany',
    data: {
      breadcrumb: '_idCompany', title: 'Company'
    },
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            component: ListComponent,
            data: {
              breadcrumb: '_idCompany', title: 'Company'
            },
          },
          {
            path: 'project/:_idProject',
            data: {
              breadcrumb: '_idProject', title: 'Project',
            },
            children: [
              {
                path: '',
                component: DetailComponent,
                data: {
                  breadcrumb: '_idProject', title: 'Project',
                },
              },
              {
                path: 'document/:_idDocument',
                component: RevisionComponent,
                data: {
                  breadcrumb: '_idDocument', title: 'Revision',
                }
              }]
          }
        ]
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class ProjectRoutingModule { }


