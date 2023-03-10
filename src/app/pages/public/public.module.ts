import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';
import { CoreModule } from '../../core/core.module';

export const routes: Routes = [
  { path: '', component:PublicComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [PublicComponent],
  imports: [
  CoreModule,
  RouterModule.forChild(routes),
  ]
})
export class PublicModule { }
