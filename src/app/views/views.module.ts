import { NgModule, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { MainPageComponent } from './mainpage/mainpage.component';
import { TopBarComponent } from './topbar/topbar.component';
import { BottomBarComponent } from './bottombar/bottombar.component';
import { RouterModule } from '@angular/router';





@NgModule({
  declarations: [
    TopBarComponent,
    BottomBarComponent,
    MainPageComponent,
  ],
  imports: [
     CoreModule,
     RouterModule,
  ],

  exports: [
    MainPageComponent
  // TopBarComponent,
  // BottomBarComponent
  ],
  providers: [
  
  ],
})

export class ViewModule {}








