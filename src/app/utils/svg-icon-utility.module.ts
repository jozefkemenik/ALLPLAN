import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';





@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SvgIconUtilityModule {
  /**
  * Import this class to app.module as well
  * This is good to prevent injecting the service as constructor parameter.
  */
  static iconRegistry: MatIconRegistry;
  static sanitizer: DomSanitizer;
  static actionIcons;
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    SvgIconUtilityModule.iconRegistry = iconRegistry;
    SvgIconUtilityModule.sanitizer = sanitizer;
    this.createActionIconMap();
    this.addSvgIcons();
  }

  //here insert as key, value connection between action and svgIcon which we call then in mat-icon
  public createActionIconMap() {

  }

  //here insert all custom icon with identifier for svgIcon
  private addSvgIcons() {
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-download-icon', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/download.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-clear-icon', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/search_close.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-search-icon', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/search.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-empty-company-icon', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/empty_company.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-empty-project-icon', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/empty_project.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-create-project-icon', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/create_project.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-delete-project-icon', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/delete_project.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-error', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/error.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-attention-red', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/attention_red.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-alert-error', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/message_error.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-alert-warning', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/message_warning.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-alert-success', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/message_success.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-alert-info', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/message_info.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-cancel', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/cancel_cross.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-goto', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/goto.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-chevron', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/chevron.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-help', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/help.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-show', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/show.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-hide', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/hide.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-send', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/send.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-administrator', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/Admin.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-employee', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/Employee.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-guest', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/Guest.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('add_member', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/add_member.svg')); 
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-cancel-participation', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/cancel_participation.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('custom-reinvite', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/images/Reinvite.svg'));

    //google_material_icons_hosting    
    SvgIconUtilityModule.iconRegistry.addSvgIcon('google_icons_keyboard_arrow_right', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/google-mat-icons/keyboard_arrow_right_black_24dp.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('google_icons_expand_more_black', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/google-mat-icons/expand_more_black_24dp.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('google_icons_delete', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/google-mat-icons/delete_black_24dp.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('google_icons_refresh', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/google-mat-icons/refresh_black_24dp.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('google_more_horiz', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/google-mat-icons/more_horiz_black_24dp.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('google_icons_cancel', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/google-mat-icons/cancel_FILL1_wght400_GRAD0_opsz20.svg'));
    SvgIconUtilityModule.iconRegistry.addSvgIcon('google_icons_dropDown', SvgIconUtilityModule.sanitizer.bypassSecurityTrustResourceUrl('assets/google-mat-icons/arrow_drop_down_FILL1_wght400_GRAD0_opsz20.svg'));
  }
}
