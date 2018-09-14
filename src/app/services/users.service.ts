import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { AuthService } from "./auth.service";
import { UserFavorites } from "../models/UserFavorites";
import { Recipe } from "../models/Recipe";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersCollection: AngularFirestoreCollection;

  constructor(
    private afs: AngularFirestore
  ) {
    this.usersCollection = this.afs.collection('users_forkify');
  }

  getUserFavorites(uid: string): AngularFirestoreCollection {
    return this.usersCollection.doc(uid).collection('favorites');
  }
}
