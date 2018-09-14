import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "firebase";
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _uid: BehaviorSubject<string> = new BehaviorSubject('');
  public uid = this._uid.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) { }

  emitUid(value: string): void {
    this._uid.next(value);
  }

  login(email: string, password: string): Promise<UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  signup(email: string, password: string): Promise<UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public get token(): Observable<string | null> {
    return this.afAuth.idToken;
  }

  public get user(): Observable<User> {
    return this.afAuth.user;
  }
}
