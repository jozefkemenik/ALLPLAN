import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { DetailComponent } from './pages/detail/detail.component';
import { CreateComponent } from './pages/create/create.component';
import { CompanyRoutingModule} from './company.routing';
import { FeatureModul} from 'src/app/features/features.module';
import { CompanyMemberComponent } from './pages/detail/tabs/company-member/company-member.component';
import { DialogAddMemberComponent} from './pages/detail/dialogs/dialog-addmember.component';
import { CompanyInfoComponent } from './pages/detail/tabs/company-info/company-info.component';
import { CompanyInfoService } from './pages/detail/tabs/company-info/company-info.service';
import { ConvertBytesToGBPipe } from '@shared/pipes/convertBytes.pipe';
import { ExcludeMemberComponent } from './pages/detail/tabs/company-member/dialogs/exclude-member/exclude-member.component';
import { CompanyMemberSidebarDetailComponent } from 'src/app/pages/company/pages/detail/tabs/company-member/sidebar/detail/detail.component';
import {CompanyMemberSidebarDetailDialogProjectsComponent} from './pages/detail/tabs/company-member/dialogs/projects/projects.component'

@NgModule({
  declarations: [
    DialogAddMemberComponent,
    DetailComponent,
    CreateComponent,
    CompanyMemberComponent,
    CompanyInfoComponent,
    ExcludeMemberComponent,
    CompanyMemberSidebarDetailComponent ,
    CompanyMemberSidebarDetailDialogProjectsComponent
  ],
  imports: [
    CoreModule,
    CompanyRoutingModule,
    FeatureModul
  ],
  providers:[CompanyInfoService, ConvertBytesToGBPipe]
})
export class CompanyModule { }
