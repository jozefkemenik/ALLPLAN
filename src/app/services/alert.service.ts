import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from './alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Alert>();

    // HERE CHANGE TO "true" IF YOU WANT ALL ALERTS TO STAY VISIBLE WHILE SWITCHING PAGES
    public keepAfterRouteChange = false;

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    // this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });
    }

    // enable subscribing to alerts observable
    onAlert(id?: string): Observable<Alert> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    // convenience methods
    success(message: string, subMessage: string, title: string, delay?: number, id?: string) {
        this.alert(new Alert({ title, message, subMessage, type: AlertType.success, delay, id }));
    }

    error(message: string, subMessage: string, title: string, delay?: number, id?: string) {
        this.alert(new Alert({ title, message, subMessage, type: AlertType.error, delay, id }));
    }

    info(message: string, subMessage: string, title: string, delay?: number, id?: string) {
        let info = new Alert({ title, message, subMessage, type: AlertType.info, delay, id });
        this.alert(info);
        return info.id;
    }

    warn(message: string, subMessage: string, title: string, delay?: number, id?: string) {
        this.alert(new Alert({ title, message, subMessage, type: AlertType.warning, delay, id }));
    }

    // main alert method    
    alert(alert: Alert) {
        this.keepAfterRouteChange = false;
        this.subject.next(alert);
    }

    // clear alert by id
    clear(id?: string) {
        this.subject.next(new Alert({ id }));
    }

    // clear all open alerts
    clearAll() {
        this.clear();
    }
}