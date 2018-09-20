import { Component, OnChanges, Input } from '@angular/core';
import { Recipe } from "../../models/Recipe";
import { FavoriteService } from "../../services/favorite.service";
import { SnackService } from "../../services/snack.service";
import { RecipeService } from "../../services/recipe.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Event } from "@angular/router";

@Component({
  selector: 'app-favorite-recipes-result',
  templateUrl: './favorite-recipes-result.component.html',
  styleUrls: ['./favorite-recipes-result.component.scss']
})
export class FavoriteRecipesResultComponent implements OnChanges {
  favoritesShowcase: Recipe[] = [];
  recipePerPage: number = 9;
  currentPage: number = 1;
  pages: number = 0;
  pagesArr: number[] = [];

  @Input('favorites') favoriteRecipes: Recipe[];

  constructor(
    private favoriteService: FavoriteService,
    private snack: SnackService,
    public spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) { }

  ngOnChanges() {
    this.pages = Math.ceil(this.favoriteRecipes.length / this.recipePerPage);
    for (let i = 0; i < this.pages; i++) {
      this.pagesArr[i] = i + 1;
    }
    this.route.queryParams.subscribe(res => {
      if (res && res.p) {
        this.currentPage = +res.p;
      } else {
        this.currentPage = 1;
      }
      this.showPage(this.currentPage);
    });
  }

  onDetails() {
    if (this.favoriteRecipes) this.recipeService.emitList(this.favoriteRecipes);
  }

  showPage(pageNumber: number = this.currentPage) {
    const start = (pageNumber - 1) * this.recipePerPage;
    const end = pageNumber * this.recipePerPage;
    this.favoritesShowcase = this.favoriteRecipes.slice(start, end);
  }

  onRemove(id: string) {
    const title = this.favoriteRecipes.filter(item => item.id === id)[0].title;
    const titleFormat = title.length > 20 ? `${title.slice(0, 20)}...` : title.slice();

    this.spinner.show();
    this.favoriteService.removeFavorite(id)
      .then(() => {
        let homeCollection = JSON.parse(localStorage.getItem('homeCollection'))
          .map(item => {
            if (item.id === id) delete item.id;
            return item;
          });
        this.spinner.hide();
        this.snack.success(`The "${titleFormat}" Recipe was removed from favorites`);
        localStorage.setItem('homeCollection', JSON.stringify(homeCollection));
      }).catch(err => {
        this.spinner.hide();
        this.snack.error(`Oops... ${err}`);
      });
  }
}
