import { Component, OnInit } from '@angular/core';
import { Recipe } from "../../models/Recipe";
import { FavoriteService } from "../../services/favorite.service";

@Component({
  selector: 'app-favorite-recipes',
  templateUrl: './favorite-recipes.component.html',
  styleUrls: ['./favorite-recipes.component.scss']
})
export class FavoriteRecipesComponent implements OnInit {
  favoriteRecipes: Recipe[];

  constructor(
    private favoriteService: FavoriteService
  ) { }

  ngOnInit() {
    this.favoriteService.getFavoriteRecipes().subscribe(res => {
      if (res) this.favoriteRecipes = res;
    });
  }
}
