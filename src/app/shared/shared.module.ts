import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PortalModule } from '@angular/cdk/portal';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarTemplateSimpleComponent } from './components/sidebar-template-simple/sidebar-template-simple.component';
import { ButtonShowMoreComponent } from './components/button-show-more/button-show-more.component';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { TimeComponent } from './dynamic-controls/time/time.component';
import { TextComponent } from './dynamic-controls/text/text.component';
import { LongTextComponent } from './dynamic-controls/long-text/long-text.component';
import { DropdownComponent } from './dynamic-controls/dropdown/dropdown.component';
import { DatetimeComponent } from './dynamic-controls/datetime/datetime.component';
import { DateComponent } from './dynamic-controls/date/date.component';
import { DynamicControlMainComponent} from './dynamic-controls/main.component';
import { EmptySectionComponent } from './components/empty-section/empty-section.component';
import { LogsDialog} from './dialogs/logs/logs-dialog';
import {TranslationDialog} from './dialogs/translation/translation-dialog'
import { DropDownComponent } from './components/drop-down/drop-down.component';
import { ButtonWithSpinnerComponent } from './components/button-with-spinner/button-with-spinner.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DynidDialog} from './dialogs/dynid/dynid-dialog';
import {IframeDialogComponent} from './dialogs/iframe-dialog/iframe-dialog';


//table section
import { TableComponent} from './components/table/table.component';
import { CustomMatPaginatorIntl } from './components/table/custom-mat-paginator';
import { MatPaginatorIntl } from "@angular/material/paginator";
import { ResizeColumnDirective } from './components/table/resize-column.directive';
import { ToolTipDirective } from './components/table/tooltip.directive';
import { ProgressBarAnimatedComponent } from './components/progress-bar-animated/progress-bar-animated.component';
//end table section


let modules = [CommonModule,
  FormsModule,
  SharedPipesModule,
  SharedDirectivesModule,
  ReactiveFormsModule,
  MatGridListModule,
  MatSnackBarModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatTableModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTooltipModule,
  PortalModule,
  MatListModule,
  MatSidenavModule,
  MatTabsModule,
  RouterModule,
  MatProgressBarModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatSlideToggleModule];

@NgModule({
  imports: modules,
  providers: [

 [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl}]
    //{ provide: LOCALE_ID, useValue: 'en-US' }
    //BreadcrumbNavService
  ],
  exports: [
    ...modules,
    SidebarComponent,
    SidebarTemplateSimpleComponent,
    ButtonShowMoreComponent,
    TimeComponent,
    TextComponent,
    LongTextComponent,
    DropdownComponent,
    DatetimeComponent,
    DateComponent,
    EmptySectionComponent,
    TableComponent,
    DropDownComponent,
    ButtonWithSpinnerComponent,
    AutocompleteComponent,
    ProgressBarAnimatedComponent,
    DynamicControlMainComponent,
    IframeDialogComponent,
    TranslationDialog
  ],
  declarations: [
    SidebarComponent,
    SidebarTemplateSimpleComponent,
    ButtonShowMoreComponent,
    TimeComponent,
    TextComponent,
    LongTextComponent,
    DropdownComponent,
    DatetimeComponent,
    DateComponent,
    EmptySectionComponent,
    LogsDialog,
    DynidDialog,
    TableComponent,
    ResizeColumnDirective,
    ToolTipDirective,
    DropDownComponent,
    ButtonWithSpinnerComponent,
    AutocompleteComponent,
    ProgressBarAnimatedComponent,
    DynamicControlMainComponent,
    IframeDialogComponent,
    TranslationDialog
  ],
})
export class SharedModule {
}




