import { NgModule , APP_INITIALIZER, ModuleWithProviders} from '@angular/core';
import { CoreModule} from '../core/core.module';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';





@NgModule({
  declarations: [
    BreadcrumbsComponent
  ],
  imports: [
    RouterModule,
    CoreModule,
 //   BreadcrumbNavComponent
   
  ],
  exports: [
    BreadcrumbsComponent
  ],
  providers: [

  ],
})

export class FeatureModul {
 
}









