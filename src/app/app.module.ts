import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { InjectUtilityModule } from './utils/inject-utility.module';
import { AppConfig } from './app.config';
import { APP_INITIALIZER } from '@angular/core';
import { SvgIconUtilityModule } from './utils/svg-icon-utility.module';
import { AlertModule } from './ui/alert/alert.module';
import { ProjectPageDialogModule } from './ui/dialogs/project-page-dialog/project-page-dialog.module';
import { ViewModule } from './views/views.module';
import { FeatureModul } from './features/features.module';
import { AppRoutingModule } from './app-routing.module';
import { TranslationService } from './core/services/translation.service';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    ViewModule,

    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,

    InjectUtilityModule,    

    SvgIconUtilityModule,
    ProjectPageDialogModule,
    AlertModule,
    FeatureModul 
  ],
  //exports:[AppRoutingModule],
  providers: [  
    AppConfig, 
    { provide: APP_INITIALIZER, useFactory: (config: AppConfig) => () => config.load(), deps: [AppConfig], multi: true },
    { provide: APP_INITIALIZER, useFactory: (config: TranslationService ) => () => config.init(), deps: [TranslationService], multi: true },
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }
