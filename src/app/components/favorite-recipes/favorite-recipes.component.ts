import { Component, OnInit } from '@angular/core';
import { Recipe } from "../../models/Recipe";
import { FavoriteService } from "../../services/favorite.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { SnackService } from "../../services/snack.service";

@Component({
  selector: 'app-favorite-recipes',
  templateUrl: './favorite-recipes.component.html',
  styleUrls: ['./favorite-recipes.component.scss']
})
export class FavoriteRecipesComponent implements OnInit {
  favoriteRecipes: Recipe[];

  constructor(
    private favoriteService: FavoriteService,
    private snack: SnackService,
    public spinner: NgxSpinnerService,
    private auth: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.favoriteService.getFavoriteRecipes().subscribe(res => {
      if (res) this.favoriteRecipes = res;
    });
  }
}
