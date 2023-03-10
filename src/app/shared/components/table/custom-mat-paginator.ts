import { Injectable} from '@angular/core';
import { TranslationService } from 'src/app/core/services/translation.service';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor(private ts: TranslationService) {
    super();
    this.updateTransl();
    this.ts.change$.subscribe(() => {
      this.updateTransl();
      this.changes.next();
    })
  }

  updateTransl() {
    this.itemsPerPageLabel = this.ts.translate('paginatorNrShown');
    this.nextPageLabel = this.ts.translate('paginatorNextPage');
    this.previousPageLabel = this.ts.translate('paginatorPrevPage')
    this.firstPageLabel = this.ts.translate('paginatorFirstPage');
    this.lastPageLabel = this.ts.translate('paginatorLastPage');
  }

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '';
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' / ' + length;
  };
}