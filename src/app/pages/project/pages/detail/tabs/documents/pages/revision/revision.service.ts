import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataAndTotalCountResult, IDataAndTotalCountResultTemplate } from '@shared/models/api/DataAndTotalCountResult';
import { DocumentRevision } from '@shared/models/api/documentRevision';
import { IDataAndTotalCountService } from '@shared/models/IDataAndTotalCountService';
import { HttpService } from 'src/app/core/services/http.service';
import { BaseService } from 'src/app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class RevisionService extends BaseService implements IDataAndTotalCountService<IDataAndTotalCountResultTemplate> {

  selectedTabIndex: number = 0;
  constructor(private httpService: HttpService) { super() }

  async getData(query: any): Promise<DataAndTotalCountResult<DocumentRevision>> {
    var documentId = (!query || !query.documentId) ? null : query.documentId;
    var path = (!query) ? null : "/documents/" + documentId + "/revisions";
    let requestData = {};
    var fullUrl: string = this.getWithQueryParameters(path, query);
    return this.httpService.get(fullUrl, requestData)
      .then(
        //response 200
        (res: DataAndTotalCountResult<DocumentRevision>) => {
          return res;

        },
        // not 200
        err => {
          return err;
        }
      );
  }

  async DeleteRevisions(documents: DocumentRevision[]): Promise<any> {
    let queryParams = new HttpParams();
    documents.forEach(doc => {
        queryParams = queryParams.append("id", doc.id);
    });
    return this.httpService.delete('/documents?' + queryParams.toString(), {});
}

}
