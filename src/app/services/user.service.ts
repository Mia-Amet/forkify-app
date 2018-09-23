import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection = this.afs.collection('users_forkify');
  private uid: string = localStorage.getItem('uid');

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  getUserFavorites(): AngularFirestoreCollection {
    if (!this.uid) {
      this.auth.authState.subscribe(res => {
        if (res) localStorage.setItem('uid', res.uid);
      });
      this.uid = JSON.parse(localStorage.getItem('uid'));
    }
    return this.usersCollection.doc(this.uid).collection('favorites');
  }

  getUserShoppingList(): AngularFirestoreCollection {
    if (!this.uid) {
      this.auth.authState.subscribe(res => {
        if (res) localStorage.setItem('uid', res.uid);
      });
      this.uid = JSON.parse(localStorage.getItem('uid'));
    }
    return this.usersCollection.doc(this.uid).collection('shopping_list');
  }
}
