import { NgModule } from '@angular/core';
import { CoreModule} from '../../../core/core.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectPageDialogComponent, ProjectPageDialogProvider } from './component/project-page-dialog.component';

@NgModule({
    imports: [
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
  
    ],
    declarations: [
        ProjectPageDialogComponent
    ],
    exports: [
        ProjectPageDialogComponent
    ],
    providers: [
        ProjectPageDialogProvider
    ]
})
export class ProjectPageDialogModule { }
