import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { AngularFireLiteApp } from '../core.service';
import { messaging } from 'firebase/app';
export declare class AngularFireLiteMessaging {
    private app;
    private platformId;
    private readonly messaging;
    private readonly browser;
    constructor(app: AngularFireLiteApp, platformId: Object);
    instance(): messaging.Messaging;
    token(): Observable<any>;
    tokenRefresh(): Subject<any>;
    requestPermission(): Observable<any>;
    deleteToken(token: string): Observable<any>;
}
