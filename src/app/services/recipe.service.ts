import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { Recipe } from "../models/Recipe";

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

  getRecipe(id: string): Observable<Object> {
    return this.http.get(`${this.proxy}${this.apiUrl}/get?key=${this.apiKey}&rId=${id}`);
  }

//  1. вывести рецепт
//  2. пролучить его индекс в массиве и массив
//  3. проверить актуальность кнопок назад / вперед
//  4. получить соседей
//  5. задать маршруты кнопкам
}
