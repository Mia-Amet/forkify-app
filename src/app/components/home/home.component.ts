import { Component, OnInit } from '@angular/core';
import { Recipe } from "../../models/Recipe";
import { SearchService } from "../../services/search.service";
import { NgxSpinnerService } from "ngx-spinner";
import { FavoriteService } from "../../services/favorite.service";
import { SnackService } from "../../services/snack.service";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { User } from "firebase";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchResult: Recipe[] = JSON.parse(localStorage.getItem('homeCollection'));
  user: User;

  constructor(
    private searchService: SearchService,
    public spinner: NgxSpinnerService,
    private favoriteService: FavoriteService,
    private auth: AuthService,
    private userService: UserService,
    private snack: SnackService
  ) { }

  ngOnInit() {
    this.auth.user.subscribe(user => this.user = user);

    if (!this.searchResult) {
      this.searchService.searchRecipe('').subscribe(res => {
        this.spinner.show();

        this.favoriteService.getFavoriteRecipes().subscribe(favorites => {
          this.searchResult = res.map(item => {
            for (let recipe of favorites) {
              if (item.title === recipe.title) item.id = recipe.id;
            }
            return item;
          });

          localStorage.setItem('homeCollection', JSON.stringify(this.searchResult));
        }, err => {
          console.log(err);
        });
      }, err => {
        this.spinner.hide();
        this.snack.error(`Oops... ${err}`);
      }, () => {
        this.spinner.hide();
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
