import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ResolveStart, NavigationStart,RoutesRecognized, ActivatedRouteSnapshot, Params, PRIMARY_OUTLET } from "@angular/router";
import { IRoutePart } from '../models/IRouterPart';
import { Observable,Subject } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';


@Injectable()
export class RoutePartsService {

  private  : Subject<IRoutePart[]>;
  private navigationEnd$: Subject<IRoutePart[]>;
  private navigationStart$: Subject<any>;
  public routeParts: IRoutePart[];
 

  constructor(private router: Router, private activeRoute: ActivatedRoute) {

    this.navigationStart$= new Subject<any>();
    this.navigationEnd$= new Subject<IRoutePart[]>();

    this.router.events.pipe(
      // only continue if routing has completed
      filter((event): event is NavigationEnd  => event instanceof NavigationEnd ),
      map(e => this.getRouteParts(activeRoute.snapshot.firstChild)),
    );
    

    this.router.events.subscribe(
      (event): void => {
        // routing started
        if (event instanceof NavigationStart) {
          this.navigationStart$.next(event);
        }
        if (event instanceof NavigationEnd) {
          this.navigationEnd$.next(this.getRouteParts(activeRoute.snapshot));      
        }
      })
  }



  subscribenavigationEnd(fn: (rp:IRoutePart[]) => any) {
    return this.navigationEnd$.subscribe({
      next: (e) => {
        fn(e);
      }
    })
  }

  subscribenavigationStart(fn: (rp:IRoutePart[]) => any) {
    this.navigationStart$.subscribe({
      next: (e) => {
        fn(e);
      }
    })
  }


  getRouteParts(snapshot: ActivatedRouteSnapshot): IRoutePart[] {
    this.routeParts = this.generateRouteParts(snapshot, snapshot.url.length?'/'+snapshot.url[0].path:'').reverse();
    return this.routeParts;
  }


  private generateRouteParts(snapshot: ActivatedRouteSnapshot, route:string=''): IRoutePart[] {
    var routeParts = <IRoutePart[]>[];
    if (snapshot) {
      if (snapshot.firstChild) {
        var child = snapshot.firstChild;
        let tempRoute = child.url.length? ('/'+child.url.map(m=>m.path).join('/') ):'';
        routeParts = routeParts.concat(this.generateRouteParts(child, route+tempRoute));
      }
      if (snapshot.url.length) {
        routeParts.push({
          title: snapshot.data['title'],
          breadcrumb: snapshot.data['breadcrumb'],
          urlSegment: snapshot.url[0].path,
          urlSegments: snapshot.url,
          params: snapshot.params,
          route:route,
          data: snapshot.data,
          disabled:snapshot.firstChild !== null && !snapshot.firstChild.url.length ? true : false,
          label: snapshot.data['breadcrumb']
        });
      }
    }
    return routeParts;
  }
}