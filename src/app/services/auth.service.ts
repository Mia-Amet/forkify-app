import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { HttpClient } from "@angular/common/http";
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) { }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  signup(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  isAuth(): boolean {
    return !!this.afAuth.auth.currentUser;
  }

  signinWithFb() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  signinWithGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
