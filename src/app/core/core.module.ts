import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { httpInterceptorProviders } from './interceptors';
import { RoutePartsService } from './services/route-parts.service';

import { ReloginDialog, ReloginDialogProvider } from '../core/guards/dialogs/relogin/relogin-dialog';
import { NoAccessDialog, NoAccessDialogProvider } from '../core/guards/dialogs/no-acces/no-access-dialog';

@NgModule({
  declarations: [
    ReloginDialog,
    NoAccessDialog
  ],
  imports: [
    RouterModule,
    SharedModule
  ],
  exports: [
    SharedModule,
  ],
  providers: [
    httpInterceptorProviders,
    RoutePartsService
  ],
})

export class CoreModule {
   //for sure to make instance (singleton), bcs its not injected in any component/service
  constructor(private re: ReloginDialogProvider, private na:NoAccessDialogProvider) { }
 
}









