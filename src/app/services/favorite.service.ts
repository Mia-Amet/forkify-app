import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Recipe } from "../models/Recipe";
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "angularfire2/firestore";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private _userFavorites: AngularFirestoreCollection;

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private auth: AuthService,
    private userService: UsersService
  ) { }

  getFavoriteRecipes(): Observable<Recipe[]> {
    if (!this.userFavorites) return;

    return this.userFavorites.snapshotChanges().pipe(
      map(recipes => recipes.map(item => {
        const data = item.payload.doc.data();
        const id = item.payload.doc.id;
        return {
          f2f_url: data.f2f_url,
          image_url: data.image_url,
          publisher: data.publisher,
          publisher_url: data.publisher_url,
          recipe_id: data.recipe_id,
          social_rank: data.social_rank,
          source_url: data.source_url,
          title: data.title,
          id
        };
      }))
    );
  }

  saveFavorite(recipe: Recipe): Promise<DocumentReference> {
    return this.userFavorites.add(recipe);
  }

  removeFavorite(id: string): Promise<void> {
    return this.userFavorites.doc(id).delete();
  }

  public set userFavorites(value: AngularFirestoreCollection) {
    this._userFavorites = value;
  }

  public get userFavorites(): AngularFirestoreCollection {
    return this._userFavorites;
  }
}
