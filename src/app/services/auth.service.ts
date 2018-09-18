import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { AngularFireAuth } from "angularfire2/auth";
import { User } from "firebase";
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;
  authState: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.user = this.afAuth.user;
    this.authState = this.afAuth.authState;
  }

  login(email: string, password: string): Promise<UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signup(email: string, password: string): Promise<UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
