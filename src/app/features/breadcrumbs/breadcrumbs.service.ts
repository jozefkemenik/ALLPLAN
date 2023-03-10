import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { Subject } from 'rxjs';
import { RoutePartsService } from '../../core/services/route-parts.service';
import { Params } from "@angular/router";

export interface IBItem {
  name: string;
  breadcrumb?: string;
  url: string;
  id?:string
}

const lsName = "ENTITY-ID-NAME"

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {
  private _updateBreacrumbs: Subject<IBItem[]>;
  items: Array<IBItem> = [];
  canShow = false;
  busy = false;
  params?: Params;
  toTranslate?:false
  

  constructor(private http: HttpService, private routePartsService: RoutePartsService) {
    this._updateBreacrumbs = new Subject<IBItem[]>();
    this.init();
  }
  /** handle routing events */
  private init() {
    this.routePartsService.subscribenavigationEnd((rp) => {
      this.params={};

      if(rp.length && rp[0].urlSegment=="login"){
        //clean local storage;
        this.cleanLS();
      }

      rp.forEach((r)=>{
        this.params = Object.assign(this.params,r.params);
      })
      // if any routing entry (except dashboard) and all breadcrumbs specified
      this.canShow = rp.length>0 && !rp.some(r => !r.breadcrumb);  
      if (!this.canShow) {
        return;
      }
      //populate from routing data    
      this.items = rp.map((r,index) => {
        return {
          breadcrumb: r.breadcrumb,
          //this "_" is identiefier that we are looking for specific ID which has be replaced by name
          name: r.breadcrumb.startsWith('_') ? '...' : r.breadcrumb,
          url: r.route,
          id: r.breadcrumb.startsWith('_')?r.params[r.breadcrumb]:null,
          toTranslate:!r.breadcrumb.startsWith('_')
        };
      });
      //throw event we have entries, but still not translated from API
      this._updateBreacrumbs.next(this.items);
      // translate it from API
      this.lookupForNames();
    });
  }
  /**
   * it could call 3 APIs  to retrieve doument name, project name or company name by ID
   * 
   */
  private lookupForNames() {
     // uncomment this in case we want to block whole page by busy, 
    //this.busy = true;
    Promise.all([this.updateNameByEntityId("_idCompany",  "groups"),
                 this.updateNameByEntityId("_idProject",  "projects"),
                 this.updateNameByEntityId("_idDocument", "documents")])
      .then(() => {
        this._updateBreacrumbs.next(this.items);
      }).catch((err) => {
        console.warn(err)
      }).finally(() => {
        // uncomment this in case we want to block whole page by busy, 
        // in the fast response maybe would be better 
        // to make default delay 200ms for displaying global busy box
        // setTimeout(()=>{
        //   this.busy = false;
        // },100);
      });
  }

  private cleanLS(){
    localStorage.removeItem(lsName);
  }
  /**
   * it updates the name in the breadcrumbs collection in the entry, where it is required
   * @param ident 
   * @param url 
   * @returns 
   */
  private updateNameByEntityId(ident:string, url:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      var item = this.items.find(i => i.breadcrumb == ident);
      
      if (item) {
        const id = this.params[ident];
        var ls = this.getFromLocalStorage(ident);
        if(ls[ident][id]){
          item.name = ls[ident][id];
          resolve(true);
          return;
        }

      
        this.http.get(`${url}/${id}`, null).then((result) => {
          if (result) {
            //update breadcrumb name
            item.name = result.name;
            ls[ident][id]= item.name;
            this.setLocalStorage(ls);
            resolve(true);
          } else {
            reject('error in retrieving ' + url + ' occurs');
          }
        }).catch((err) => {
          reject('error in retrieving ' + url + ' occurs');
        });
      } else {
        resolve(true);
      }
    });
  }


private getFromLocalStorage(entity){
  let ls = {};
  let lsStr = localStorage.getItem(lsName);
  if(lsStr){
    ls =  JSON.parse(lsStr);
  }
  if(!ls[entity]){
    ls[entity]={};
  } 
  return ls
}
/**
 * 
 * @param ls 
 */
private setLocalStorage(ls:any){
  localStorage.setItem(lsName,JSON.stringify(ls));
}

  /**
   * 
   * @param fn subscribe the changes on breadcrumbs collections
   */
  subscribeUpdateBreacrumbs(fn: (bi: IBItem[]) => any) {
    this._updateBreacrumbs.subscribe({
      next: (e) => {
        fn(e);
      }
    })
  }
/**
 * 
 * @param name 
 * @param url 
 */
  insertItem(name:string, id:string, breadcrumb:string) {
    let url = `${location.href}/${id}`; 
    const breadcrumbItem = this.items.find(i=>i.breadcrumb==breadcrumb);
    if(breadcrumbItem ){  
      url = location.href.replace(breadcrumbItem.id,id)
      breadcrumbItem.id=id;
      breadcrumbItem.name = name;
      breadcrumbItem.url=url;
    }else{
      this.items.push({ id:id,name: name, url: url,breadcrumb:breadcrumb});
    }
    //make url without reload
    window.history.pushState({name:name}, '', url); 
    this._updateBreacrumbs.next(this.items);
  }
  /**
   * 
   */
  removeInsertedItem(id?:string) {
     const item = this.items.find(i=>i.id==id);
     if(item){    
      const url = location.href.replace("/"+id,"")
      window.history.pushState({name:item.name}, '', url);  
      const index =  this.items.indexOf(item);
      this.items.splice(index, 1);
      this._updateBreacrumbs.next(this.items);
    }  
  }

  removeInsertedItemByName(name:string) {
    const item = this.items.find(i=>i.breadcrumb==name);
    if(item){    
     const url = location.href.replace("/"+item.id,"")
     window.history.pushState({name:item.name}, '', url);  
     const index =  this.items.indexOf(item);
     this.items.splice(index, 1);
     this._updateBreacrumbs.next(this.items);
   }  
 }

}
