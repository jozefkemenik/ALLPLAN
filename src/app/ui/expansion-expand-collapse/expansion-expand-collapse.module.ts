import { NgModule } from '@angular/core';
import { ExpansionExpandCollapseComponent } from './component/expansion-expand-collapse.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CoreModule} from '../../core/core.module'

@NgModule({
  imports: [   
    ScrollingModule,
    CoreModule
  ],
  declarations: [ExpansionExpandCollapseComponent],
  exports: [ExpansionExpandCollapseComponent],
})
export class ExpansionExpandCollapseModule { }
