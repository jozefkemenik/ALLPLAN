import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { ProjectRoutingModule } from './project.routing';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import {ProjectDocumentsComponent} from './pages/detail/tabs/documents/documents.component';
import { ExpansionExpandCollapseModule } from '../../ui/expansion-expand-collapse/expansion-expand-collapse.module';
import { PrjDocPageSideBarCurrentIndexComponent } from './pages/detail/tabs/documents/sidebar-tabs/prj-doc-page-side-bar-current-index/prj-doc-page-side-bar-current-index.component';
import { PrjDocPageSideBarGeneralComponent } from './pages/detail/tabs/documents/sidebar-tabs/prj-doc-page-side-bar-general/prj-doc-page-side-bar-general.component';
import { PrjDocPageSideBarTrackingComponent } from './pages/detail/tabs/documents/sidebar-tabs/prj-doc-page-side-bar-tracking/prj-doc-page-side-bar-tracking.component';
import { FeatureModul} from 'src/app/features/features.module';
import { RevisionComponent } from './pages/detail/tabs/documents/pages/revision/revision.component';
import { ParticipantsComponent } from './pages/detail/tabs/participants/participants.component';
import { DeleteDocumentsDialogComponent } from './pages/detail/tabs/documents/dialogs/delete/delete.component';
import { AddParticipantDialogComponent } from './pages/detail/tabs/participants/dialogs/add-participant/add-participant.component';
import { SelectRecipientsDialogComponent } from './pages/detail/tabs/documents/dialogs/select-recipients/select-recipients.component';
import { ExcludeParticipantComponent } from './pages/detail/tabs/participants/dialogs/exclude-participant/exclude-participant.component';
import {ProjectParticipantsSidebarDetailComponent } from './pages/detail/tabs/participants/sidebar/detail/detail.component';
import { DeleteRevisionDialogComponent } from './pages/detail/tabs/documents/pages/revision/dialogs/deleteRevisionDialog/deleteRevisionDialog.component';
@NgModule({
  declarations: [
    ListComponent,
    DetailComponent,
    ProjectDocumentsComponent,
    PrjDocPageSideBarCurrentIndexComponent,
    PrjDocPageSideBarGeneralComponent,
    PrjDocPageSideBarTrackingComponent,
    RevisionComponent,
    ParticipantsComponent,
    DeleteDocumentsDialogComponent,
    AddParticipantDialogComponent,
    SelectRecipientsDialogComponent,
    ExcludeParticipantComponent,
    ProjectParticipantsSidebarDetailComponent,
    DeleteRevisionDialogComponent
  ],
  imports: [
    CoreModule,
    ProjectRoutingModule,
    ExpansionExpandCollapseModule,
    FeatureModul
  ]
})
export class ProjectModule { }
