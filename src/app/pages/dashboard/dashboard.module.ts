
import { NgModule } from '@angular/core';
import { DashboardComponent } from './component/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../../core/core.module';

export const routes: Routes = [
    { path: '', component: DashboardComponent, pathMatch: 'full' }
  ];

@NgModule({
    imports: [
        CoreModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        DashboardComponent
    ],
    exports: [  
    ]
})

export class DashboardModule { }
