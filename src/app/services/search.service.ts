import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "angularfire2/firestore";
import { Observable } from "rxjs";
import { Recipe } from "../models/Recipe";
import { SearchRequest } from "../models/SearchRequest";
import { SearchCollectionItem } from "../models/SearchCollectionItem";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiKey: string = environment.apiKeyFood2Fork;
  private apiUrl: string = environment.apiUrlFood2Fork;
  private proxy: string = environment.proxy;
  private searchHistory: AngularFirestoreCollection;

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore
  ) {
    this.searchHistory = this.afs.collection('search_history');
  }

  getSearchHistory(): Observable<SearchCollectionItem[]> {
    return this.searchHistory.snapshotChanges().pipe(
      map(actions => actions.map(item => {
        const data = item.payload.doc.data();
        const id = item.payload.doc.id;
        return { name: data.name, date: data.date, id };
      }))
    )
  }

  saveSearchHistory(value: string): Promise<DocumentReference> {
    const newItem: SearchCollectionItem = {
      name: value,
      date: Date.now()
    };
    return this.searchHistory.add(newItem);
  }

  searchRecipe(value: string): Observable<Recipe[]> {
    return this.http.get(`${this.proxy}${this.apiUrl}/search?key=${this.apiKey}&q=${value}`).pipe(
      map((res: SearchRequest): Recipe[] => res.recipes)
    );
  }
}
