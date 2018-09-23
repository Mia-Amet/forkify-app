import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "angularfire2/firestore";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { Observable } from "rxjs";
import { ShoppingList } from "../models/ShoppingList";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  userShoppingList: AngularFirestoreCollection = this.userService.getUserShoppingList();

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private auth: AuthService,
    private userService: UserService
  ) { }

  getShoppingList(): Observable<ShoppingList[]> {
    return this.userShoppingList.snapshotChanges().pipe(
      map(list => list.map(item => {
        const data = item.payload.doc.data();
        const id = item.payload.doc.id;
        return {
          title: data.title,
          source_url: data.source_url,
          add_date: data.add_date,
          ingredients: data.ingredients,
          recipe_id: data.recipe_id,
          id
        }
      }))
    );
  }

  saveShoppingList(list: ShoppingList): Promise<DocumentReference> {
    return this.userShoppingList.add(list);
  }

  removeShoppingList(id: string): Promise<void> {
    return this.userShoppingList.doc(id).delete();
  }
}
