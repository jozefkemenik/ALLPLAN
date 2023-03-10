import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService { 
    constructor() { }

    private _store={}

    getItem(name:string){
        return this._store[name]
    }
    setItem(name:string,value:any){
        return this._store[name]=value
    }
}
