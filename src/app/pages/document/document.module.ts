import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { DetailComponent } from './pages/detail/detail.component';
import { DocumentRoutingModule } from './document.routing';




@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    DetailComponent
  ],
  imports: [
    CoreModule,
    DocumentRoutingModule,
  ]
})
export class DocumentModule { }
