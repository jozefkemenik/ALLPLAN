import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AutocompleteItems } from '@shared/models/autocomplete';
import { asyncScheduler, fromEvent, scheduled } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'ap-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AutocompleteComponent implements OnInit {

  chipsItems: any = [];
  chipRemovable: boolean = true;

  @ViewChild('itemsSearchInput') itemsInput: ElementRef;
  autocompleteInput: string;

  @Input() isLoading: boolean = false;
  isDisabled: boolean = false;
  showSearches: boolean = false;

  @Input() projectId: string;

  @Input() inputPlaceholder: any;

  @Output() getItemsEvent = new EventEmitter<any>();
  @Input() items: Array<AutocompleteItems>;

  @Output() sendChipsList = new EventEmitter<any>();

  lastSearchValue: string = "";
  emptyInput: boolean = true;

  @Input() context: string;

  constructor() {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.Search();
  }

  removeChip(chip: any): void {
    const index = this.chipsItems.indexOf(chip);
    if (index >= 0) {
      this.chipsItems.splice(index, 1);
      this.sendChipsList.emit(this.chipsItems);
      this.items = [];
      this.itemsInput.nativeElement.value = "";
      this.autocompleteInput = '';
      this.lastSearchValue = "";
      //this.getItemsEvent.emit({ requestdata: true, searchTerm: this.lastSearchValue, emptyInput: false });
    }
  }

  Search() {
    const search$ = fromEvent(this.itemsInput.nativeElement, 'keyup').pipe(
      tap((event: any) => {
        this.emptyInput = event.target.value.length < 1 ? true : false;
        if (this.emptyInput) {
          this.items = [];
          this.getItemsEvent.emit({ requestdata: false, searchTerm: "", emptyInput: this.emptyInput });
        }
        return event.target.value;
      }),
      map((event: any) => event.target.value),
      debounceTime(500),
      //distinctUntilChanged(), //this is to note repeat getData for same value twice
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(async (term) => {
        return term ? this.getData(term) : scheduled<any>(this.items, asyncScheduler);
      }),
      tap(() => {
        this.isDisabled = false;
        this.showSearches = true;
      }));

    search$.subscribe(data => {
      this.isLoading = false;
    })
  }

  getSelectedValue(item: AutocompleteItems) {
    //this.items = this.removeSelectedFromAutocompleteItems(item);
    this.chipsItems.push(item);
    this.lastSearchValue = "";
    this.sendChipsList.emit(this.chipsItems);
    this.itemsInput.nativeElement.value = "";
    this.autocompleteInput = '';
    this.items = [];
  }

  removeSelectedFromAutocompleteItems(selected: AutocompleteItems) {
    let res = new Array<AutocompleteItems>;
    this.items.forEach(element => {
      if (selected.title !== element.title) res.push(element);
    });
    return res;
  }

  getData(searchTerm: string) {
    if (searchTerm.length > 0) {
      this.lastSearchValue = searchTerm;
      this.getItemsEvent.emit({ requestdata: true, searchTerm: searchTerm, emptyInput: this.emptyInput });
    }
    this.getItemsEvent.emit({ requestdata: false, searchTerm: searchTerm, emptyInput: true });
  }
}