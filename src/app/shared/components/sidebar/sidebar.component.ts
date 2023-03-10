import { Component, ViewChild, Input, Output, EventEmitter, ViewEncapsulation, TemplateRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';


export interface ITemplateRefType {
  templateRef: TemplateRef<any>;
  title: string;
  context: string;
  disabled?: boolean;
  translation: any;
}

@Component({
  selector: 'ap-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class SidebarComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  private isOpenValue: boolean;
  private tabIndexValue?: number = null;
  activeTab: ITemplateRefType;
  @Input() title?: string
  @Input() sidebarContent?: TemplateRef<any>;
  @Input() sidebarFooter?: TemplateRef<any>;
  @Input() tabs: Array<ITemplateRefType>;

  /** two binding tabIndex */
  @Input() get tabIndex(): number | null {
    return this.tabIndexValue;
  }
  @Output() tabIndexChange = new EventEmitter();
  set tabIndex(value: number) {
    if (this.tabs && value < this.tabs.length) {
      this.activeTab = this.tabs[value];
      this.tabIndexValue = value;
      this.tabIndexChange.emit(this.tabIndexValue);
    }
  }

  /** two binding isOpen */
  @Input() get isOpen() { return this.isOpenValue; }
  @Output() isOpenChange = new EventEmitter();
  set isOpen(value: boolean) {
    this.isOpenValue = value;
    this.isOpenChange.emit(this.isOpenValue);
    if (!this.sidenav) return;
    if (value) {
      this.sidenav.open();
    } else { this.sidenav.close(); }
  }
  constructor() {
  }
  /** methods */
  close() {
    this.isOpen = false;
  }
  tabClick(tab) {
    this.tabIndex = this.tabs ? this.tabs.indexOf(tab) : null;
  }
  /** end methods */

  /** life cycle events */
  ngOnInit() {
    //when tab index is not used, select first tab as active
    if (this.tabIndexValue == null) {
      this.tabIndex = 0;
    }
  }
  ngAfterViewInit() {
    this.sidenav.mode = 'over';
    this.sidenav.position = 'end';
    this.sidenav.autoFocus = false;
  }
  /** lend ife cycle events */ 
}
