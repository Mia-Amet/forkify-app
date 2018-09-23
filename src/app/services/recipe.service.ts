import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Recipe, RecipeExt } from "../models/Recipe";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiKey: string = environment.apiKeyFood2Fork;
  private apiUrl: string = environment.apiUrlFood2Fork;
  private proxy: string = environment.proxy;
  private currentList: BehaviorSubject<Recipe[]> = new BehaviorSubject([]);
  public listState = this.currentList.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  emitList(array: Recipe[]): void {
    this.currentList.next(array);
  }

  getRecipe(id: string): Observable<RecipeExt> {
    return this.http.get(`${this.proxy}${this.apiUrl}/get?key=${this.apiKey}&rId=${id}`).pipe(
      map((res: Object) => res['recipe'])
    );
  }
}
