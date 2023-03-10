import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { BaseService } from './base.service';
import { IDataService, ResultWrapper } from '../shared/models/IDataService';
import { mock_folders, mock_files } from './mockDataDocuments';
import { ProjectService } from './project.service';
import { AlertService } from './alert.service';

export interface DocumentDetailData {
  _id: number; // change to ObjectId when data from BE available
  id_Folder: number,
  name: string;
  layoutNumber: string;
  formats: string;
  date: string;
}

export interface DocumentData {
  _id: number; // change to ObjectId when data from BE available
  name: string;
  layoutNumber: number;
  formats: string;
  date: string;
  //documentDetail: Array<DocumentDetailData>;
  //documentDetail: Array<DocumentDetailData> | MatTableDataSource<DocumentDetailData>
}

export interface PresignedUrl {
    url:string;
    revisionId:string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsService extends BaseService implements IDataService {

  constructor(private http: HttpClient, private projectService: ProjectService, private alertService: AlertService) { super() }

  //TODO change to BE call
  getData(query: any): Observable<ResultWrapper> {
    var result = of({ data: mock_folders, total: 2 });
    return result;
  }

  getDataForSelect(data: any): Observable<ResultWrapper> { //change to BE method and return data
    var query = { groupId: data.groupId, pageStart: 0, pageSize: 10, searchTerm: undefined, sortingConfig: undefined };   
    return this.projectService.getData(query);
  }

  //TODO change to BE call
  getDataForInnerTable(idFolder: number) {
    var resultData = [];
    mock_files.forEach(function (item, index) {
      if (item.id_Folder === idFolder) {
        resultData.push(item);
      }
    });
    var result = of({ data: resultData, total: 2 });
    return result;
  }

  async uploadFileToS3bucket(file: File, newRevisionId: string, presignedUrl: string) {

    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignedUrl);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.debug('success');
                    //this.alertService.success('File has been uploaded successfully', "", null, 5000);
                    resolve({ successful: true });
                } else {
                    xhr.statusText
                    console.error(xhr.response);
                    this.alertService.error('Error occured during file upload', "", null, 5000);
                    reject(xhr.response);
                }
            }
        };
        xhr.send(file);

    });



            // const formData = new FormData();
            // formData.append(newRevisionId, file.name);

            // const upload$ = this.http.post("/api/thumbnail-upload", formData, {
            //     reportProgress: true,
            //     observe: 'events'
            // })
            // .pipe(
            //     finalize(() => this.reset())
            // );
            
            // this.uploadSub = upload$.subscribe(event => {
            //     if (event.type == HttpEventType.UploadProgress) {
            //     this.uploadProgress = Math.round(100 * (event.loaded / event.total));
            //     }
            //         })
  }

//   async uploadAndCreateDocumentIfMissing(projectId: string, formData: FormData): Promise<any> {
//     return this.http.post(`${environment.apiUrl}/projects/${projectId}/documents/upload`, formData).toPromise();
//   }

  async createDocument(projectId: string, requestData: any): Promise<any> {
    return this.http.post(`${environment.apiUrl}/projects/${projectId}/documents`, requestData).toPromise();
  }

  async completeDocumentCreation(projectId: string, requestData: any): Promise<any> {
    return this.http.post(`${environment.apiUrl}/projects/${projectId}/documents/complete`, requestData).toPromise();
  }

}



