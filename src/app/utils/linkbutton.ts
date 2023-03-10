export class LinkButton {

  selected: boolean = false;
  id: number;

  constructor(
    public name: string, public key: string
  ) { }

}

export class LinkButtonGroup {

  private links: LinkButton[];

  add(lb : LinkButton) {
    if (!this.links) {
      this.links = [];
    }
    lb.id = this.links.length;
    this.links.push(lb);
  }

  addWithCaptionAndKey(name: string, key: string) {
    this.add(new LinkButton(name, key));
  }

  get() {
    return this.links;
  }

  select(id: number) {
    if (this.links) {
      this.links.forEach(l => {l.selected = false; if (l.id === id) l.selected = true;});
    }    
  }

}
