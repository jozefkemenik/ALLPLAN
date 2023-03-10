import {  Params } from "@angular/router";

export interface IRoutePart {
  title: string,
  params?: Params,
  urlSegments: any[],
  data?:Object,
  urlSegment?: string,
  route?: string,
  breadcrumb?: string,
  disabled?: boolean, 
  label: string
}
