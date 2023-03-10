import { Directive, OnInit, AfterViewInit, OnDestroy, Renderer2, Input, ElementRef } from "@angular/core";

@Directive({
  selector: "[resizeColumn]"
})
export class ResizeColumnDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input("resizeColumn") resizable: boolean;


  private startX: number;

  private startWidth: number;

  private column: HTMLElement;

  private table: HTMLElement;

  private pressed: boolean;

  public isResizing: boolean;

  private listeners = [() => { }];


  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.column = this.el.nativeElement;
  }

  ngOnInit() {

    if (this.resizable) {
      const row = this.renderer.parentNode(this.column);
      const thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(thead);

      const resizer = this.renderer.createElement("span");
      this.renderer.addClass(resizer, "resize-holder");
      this.renderer.appendChild(this.column, resizer);
      this.listeners.push(this.renderer.listen(resizer, "mousedown", this.onMouseDown));
      this.listeners.push(this.renderer.listen(this.table, "mousemove", this.onMouseMove));
      this.listeners.push(this.renderer.listen("document", "mouseup", this.onMouseUp));

    }
    //settings for span dots ...
    this.setSettingsForTextSpan();
  }


  ngAfterViewInit() {

  }

  //apply style changes for span in Th columns
  setSettingsForTextSpan() {
    const width = this.column.attributes['data-width'].value;
    const minWidth =this.column.attributes['data-min-width'].value;
    const maxWidth = this.column.attributes['data-max-width'].value;
    this.column['style']['width'] = width 
    this.column['style']['min-width'] = minWidth;
    this.column['style']['max-width'] = maxWidth;
    this.column.children[0]['style']['width'] = width; 
    this.column.children[0]['style']['min-width'] = minWidth;
    this.column.children[0]['style']['max-width'] = maxWidth;
  }

  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    if (this.pressed && event.buttons) {
      this.renderer.addClass(this.table, "resizing");
      let width =
        this.startWidth + (event.pageX - this.startX );
        this.setWidthColumn(width);      
    }
  };


  setWidthColumn(width: number) {
    const minWidth =   Number(this.column.style['min-width'].replace(/\D/g, ''));
    const maxWidth =   Number(this.column.style['max-width'].replace(/\D/g, ''));
    if( (!minWidth || width>=minWidth) && (!maxWidth ||  width<=maxWidth)){
      this.renderer.setStyle(this.column,  "width", `${width}px`);
      this.renderer.setStyle(this.column.childNodes[0],  "width", `${width}px`);
      const headerTextNode =  this.column.getElementsByClassName("no-wrap-text-header")[0]
      headerTextNode['style']['max-width']=width+'px'; 
    }
  }

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, "resizing");
    }
  };


  ngOnDestroy() {
    //destroy listeners;
    this.listeners.forEach((l) => { l() });
  }


}
