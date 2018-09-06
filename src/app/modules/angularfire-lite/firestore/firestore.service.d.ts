import { AngularFireLiteApp } from '../core.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { TransferState } from '@angular/platform-browser';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'firebase/firestore';
export declare class AngularFireLiteFirestore {
    private app;
    private http;
    private state;
    private platformId;
    private readonly firestore;
    private readonly config;
    private readonly browser;
    constructor(app: AngularFireLiteApp, http: HttpClient, state: TransferState, platformId: Object);
    read(ref: string): Observable<any> | BehaviorSubject<any>;
    write(ref: string, data: Object, merge?: boolean): Observable<any>;
    push(ref: string, data: Object): Observable<any>;
    update(ref: string, data: Object): Observable<any>;
    remove(DocumentRef: string): Observable<any>;
    removeField(ref: string, ...fields: any[]): Observable<any>;
    removeCollection(collectionRef: string): Observable<any>;
    query(ref: string): {
        where(document: string, comparison: string, value: any): Query;
        startAt(...startValue: any[]): Query;
        startAfter(...startValue: any[]): Query;
        endAt(...endValue: any[]): Query;
        endBefore(...endValue: any[]): Query;
        limit(limit: number): Query;
        orderBy(path: string, order?: "desc" | "asc"): Query;
        on(): Observable<any> | BehaviorSubject<any>;
        get(): Observable<any> | BehaviorSubject<any>;
    };
    transaction(): Transaction;
    batch(): Batch;
}
export declare function FormatServerData(value: any): {
    'booleanValue': any;
} | {
    'stringValue': any;
} | {
    'doubleValue': any;
} | {
    'arrayValue': any;
};
export interface Batch {
    set(ref: string, data: Object): Batch;
    update(ref: string, data: Object): Batch;
    delete(ref: string): Batch;
    commit(): Observable<any>;
}
export interface Transaction {
    set(ref: string, data: Object): Transaction;
    get(ref: string): Subject<any>;
    run(): Observable<any>;
}
export interface Query {
    where(document: string, comparison: string, value: any): Query;
    startAt(...startValue: Array<string>): Query;
    endAt(...endValue: Array<string>): Query;
    startAfter(...startValue: Array<string>): Query;
    endBefore(...endValue: Array<string>): Query;
    limit(limit: number): Query;
    orderBy(path: string, order?: 'asc' | 'desc'): Query;
    on(): BehaviorSubject<any> | Observable<any>;
    get(): BehaviorSubject<any> | Observable<any>;
}
