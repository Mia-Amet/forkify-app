import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { AngularFireLiteApp } from '../core.service';
export declare class AngularFireLiteAuth {
    private app;
    private http;
    private platformId;
    private readonly auth;
    private readonly config;
    private readonly browser;
    private readonly server;
    constructor(app: AngularFireLiteApp, http: HttpClient, platformId: Object);
    uid(): Subject<any>;
    isAuthenticated(): Subject<any>;
    isAnonymous(): Subject<any>;
    currentUser(): Subject<any>;
    userData(): Subject<any> | Observable<any>;
    providers(email: string): Subject<any> | Observable<any>;
    signin(email: string, password: string): Observable<any>;
    signinAnonymously(): Observable<any>;
    signup(email: string, password: string): Observable<any>;
    signout(): Observable<any>;
    updateProfile(data: {
        displayName: string | null;
        photoURL: string | null;
    }): Observable<any> | Promise<Observable<Object>>;
    updateEmail(newEmail: string): Observable<any> | Promise<Observable<Object>>;
    updatePassword(newPassword: string): Observable<any> | Promise<Observable<Object>>;
    verifyPasswordResetCode(code: string): Observable<any>;
    confirmPasswordReset(code: string, newPassword: string): Observable<any>;
    relogin(credentials: any): Observable<any>;
    deletePermanently(): Observable<any>;
    sendEmailVerification(): Observable<any>;
    sendPasswordResetEmail(email: string): Observable<any>;
}
