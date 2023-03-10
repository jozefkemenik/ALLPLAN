
import { NgModule } from '@angular/core';

import { NewsComponent } from './news.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../../core/core.module';

export const routes: Routes = [
    { path: '', component: NewsComponent, pathMatch: 'full' }
  ];

@NgModule({
    imports: [
        CoreModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        NewsComponent
    ],
    exports: [  
    ]
})

export class NewsModule { }
