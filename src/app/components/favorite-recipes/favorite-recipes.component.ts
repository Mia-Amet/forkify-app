import { Component, OnInit } from '@angular/core';
import { Recipe } from "../../models/Recipe";
import { FavoriteService } from "../../services/favorite.service";
import { DialogService } from "../../services/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../../services/auth.service";
import { UsersService } from "../../services/users.service";

@Component({
  selector: 'app-favorite-recipes',
  templateUrl: './favorite-recipes.component.html',
  styleUrls: ['./favorite-recipes.component.scss']
})
export class FavoriteRecipesComponent implements OnInit {
  favoriteRecipes: Recipe[];
  private uid: string;

  constructor(
    private favoriteService: FavoriteService,
    private dialog: DialogService,
    public spinner: NgxSpinnerService,
    private auth: AuthService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.auth.uid.subscribe(uid => {
      if (!uid) return;

      this.uid = uid;
      this.spinner.show();
      this.favoriteService.userFavorites = this.usersService.getUserFavorites(this.uid);

      this.favoriteService.getFavoriteRecipes().subscribe(res => {
        this.spinner.hide();
        this.favoriteRecipes = res;
      }, err => {
        this.spinner.hide();
        this.dialog.error(`Oops... ${err}`, 'Error!');
      });
    });
  }
}
