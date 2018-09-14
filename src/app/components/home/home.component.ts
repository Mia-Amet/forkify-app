import { Component, OnInit } from '@angular/core';
import { Recipe } from "../../models/Recipe";
import { SearchService } from "../../services/search.service";
import { NgxSpinnerService } from "ngx-spinner";
import { FavoriteService } from "../../services/favorite.service";
import { DialogService } from "../../services/dialog.service";
import { AuthService } from "../../services/auth.service";
import { UsersService } from "../../services/users.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchResult: Recipe[] = JSON.parse(localStorage.getItem('homeCollection'));
  private uid: string;

  constructor(
    private searchService: SearchService,
    public spinner: NgxSpinnerService,
    private favoriteService: FavoriteService,
    private dialog: DialogService,
    private auth: AuthService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.auth.uid.subscribe(res => {
      if (!res) return;

      this.uid = res;
      this.favoriteService.userFavorites = this.usersService.getUserFavorites(this.uid);
    });

    if (!this.searchResult) {
      this.spinner.show();
      this.searchService.searchRecipe('').subscribe(res => {
        this.spinner.hide();

        this.favoriteService.getFavoriteRecipes().subscribe(favorites => {
          this.searchResult = res.map(item => {
            for (let recipe of favorites) {
              if (item.title === recipe.title) item.id = recipe.id;
            }
            return item;
          });

          localStorage.setItem('homeCollection', JSON.stringify(this.searchResult));
        });
      }, err => {
        this.spinner.hide();
        this.dialog.error(`Oops... ${err}`, 'Error!');
      });
    }
  }

  onGetRecipes(res: Recipe[]) {
    this.searchResult = res;
  }

  onGetRecipe(item: Recipe) {
    let homeCollection = JSON.parse(localStorage.getItem('homeCollection'));

    homeCollection.forEach(recipe => {
      if (recipe.title === item.title) recipe.id = item.id;
    });
    localStorage.setItem('homeCollection', JSON.stringify(homeCollection));

    if (this.searchResult) {
      this.searchResult.forEach(recipe => {
        if (recipe.title === item.title) recipe.id = item.id;
      });
    }
  }
}
