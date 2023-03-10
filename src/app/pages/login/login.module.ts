import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { CoreModule } from '../../core/core.module';
import { RouterModule, Routes } from '@angular/router';


export const routes: Routes = [
    { path: '', component: LoginComponent, pathMatch: 'full' }
  ];

@NgModule({
    imports: [
        CoreModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        LoginComponent
    ],
    exports: [ 
    ],
    providers: []
})

export class LoginModule { }
