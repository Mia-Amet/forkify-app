import { Observable } from 'rxjs/';
import { AngularFireLiteApp } from '../core.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { TransferState } from '@angular/platform-browser';
import 'rxjs/add/operator/map';
export declare class AngularFireLiteDatabase {
    private app;
    private http;
    private state;
    private platformId;
    private readonly database;
    private readonly config;
    private readonly server;
    private readonly browser;
    private readonly ref;
    constructor(app: AngularFireLiteApp, http: HttpClient, state: TransferState, platformId: Object);
    read(ref: string): BehaviorSubject<any> | Observable<any>;
    childAdded(ref: string): BehaviorSubject<any> | Observable<any>;
    childChanged(ref: string): BehaviorSubject<any> | Observable<any>;
    childRemoved(ref: string): BehaviorSubject<any> | Observable<any>;
    childMoved(ref: string): BehaviorSubject<any> | Observable<any>;
    private SRH(ref, DSK);
    private BRH(ref, event, DSK);
    write(ref: string, data: Object): Observable<any>;
    push(ref: string, data: any): Observable<any>;
    update(ref: string, data: any): Observable<any>;
    remove(ref: string): Observable<any>;
    query(ref: string): {
        startAt(value: string | number | boolean): RDQuery;
        endAt(value: string | number | boolean): RDQuery;
        equalTo(value: string | number | boolean): RDQuery;
        isEqual(query: any): boolean;
        limitToFirst(limit: number): RDQuery;
        limitToLast(limit: number): RDQuery;
        orderByChild(path: string): RDQuery;
        orderByKey(): RDQuery;
        orderByPriority(): RDQuery;
        orderByValue(): RDQuery;
        on(event: "value" | "child_added" | "child_changed" | "child_removed" | "child_moved"): Observable<any> | BehaviorSubject<any>;
        once(event: "value" | "child_added" | "child_changed" | "child_removed" | "child_moved"): Observable<any> | BehaviorSubject<any>;
    };
}
export interface RDQuery {
    startAt(value: number | string | boolean | null): RDQuery;
    endAt(value: number | string | boolean | null): RDQuery;
    equalTo(value: number | string | boolean | null): RDQuery;
    isEqual(other: RDQuery | null): boolean;
    limitToFirst(limit: number): RDQuery;
    limitToLast(limit: number): RDQuery;
    orderByChild(path: string): RDQuery;
    orderByKey(): RDQuery;
    orderByPriority(): RDQuery;
    orderByValue(): RDQuery;
    on(eventType: 'value' | 'child_added' | 'child_changed' | 'child_removed' | 'child_moved'): Observable<any> | any;
    once(eventType: 'value' | 'child_added' | 'child_changed' | 'child_removed' | 'child_moved'): Observable<any> | any;
}
