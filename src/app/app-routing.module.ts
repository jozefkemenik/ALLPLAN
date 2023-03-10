
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import {EIframeDialogType} from 'src/app/pages/public/public.component'



const routes: Routes = [
  {
    canActivate: [AuthGuard],
    path: 'login',
    data: { title: 'Login', hideTopMenu:true },
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
  },
  {
    canActivate: [AuthGuard],
    path: '',
    data: { title: 'Dashboard'},
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    canActivate: [AuthGuard],
    path: 'news',
    data: { title: 'News', breadcrumb: 'news'},
    loadChildren: () => import('./pages/news/news.module').then(m => m.NewsModule),
  },

  {
    canActivate: [AuthGuard],
    path: 'companies',
    data: { title: 'Overview', breadcrumb: 'overview'},
    loadChildren: () => import(`./pages/project/project.module`).then(m => m.ProjectModule),   
  },
  {
    canActivate: [AuthGuard],
    path: 'company',
    data: { title: 'Overview', breadcrumb: 'overview'},
    loadChildren: () => import(`./pages/company/company.module`).then(m => m.CompanyModule),   
  },
  {
    canActivate: [AuthGuard],
    path: 'document',
    data: { title: 'Overview', breadcrumb: 'overview'},
    loadChildren: () => import(`./pages/document/document.module`).then(m => m.DocumentModule),   
  },
  {
    canActivate: [AuthGuard],
    path: 'noaccess',
    data: { title: 'No access', breadcrumb: 'overview'},
    loadChildren: () => import(`./pages/noaccess/noaccess.module`).then(m => m.NoaccessModule),   
  },
  {
    canActivate: [AuthGuard],
    path: 'confirmtermsofuse',
    data: { title: 'Terms of use', showPartialTopMenu:true},
    loadChildren: () => import(`./pages/termsofuse/termsofuse.module`).then(m => m.TermsofuseModule),   
  },
    {
    //canActivate: [AuthGuard],
    path: 'confirminvitation',
    data: { title: 'Confirm Invitation', showPartialTopMenu:true},
    loadChildren: () => import(`./pages/invitation/invitation.module`).then(m => m.InvitationModule),   
  },

  {
    //canActivate: [AuthGuard],
    path: 'legal-notice',
    data: { title: 'Legal Notice',type:EIframeDialogType.ImPrint},
    loadChildren: () => import(`./pages/public/public.module`).then(m => m.PublicModule),   
  },
  {
    //canActivate: [AuthGuard],
    path: 'terms-of-use',
    data: { title: 'Terms of use',type:EIframeDialogType.TermsOfUse},
    loadChildren: () => import(`./pages/public/public.module`).then(m => m.PublicModule),   
  },

  {
    //canActivate: [AuthGuard],
    path: 'privacy-policy',
    data: { title: 'Privacy Policy', type:EIframeDialogType.Privacy},
    loadChildren: () => import(`./pages/public/public.module`).then(m => m.PublicModule),   
  },
  {
    //canActivate: [AuthGuard],
    path: 'help',
    data: { title: 'Help', type:EIframeDialogType.Help},
    loadChildren: () => import(`./pages/public/public.module`).then(m => m.PublicModule),   
  },

  

  
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    enableTracing: false // <-- set true fo debugging purposes (logs events to console)
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }


