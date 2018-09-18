import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from "../../models/Recipe";
import { FavoriteService } from "../../services/favorite.service";
import { NgxSpinnerService } from "ngx-spinner";
import { SnackService } from "../../services/snack.service";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnChanges {
  recipesShowcase: Recipe[] = [];
  recipePerPage: number = 9;
  currentPage: number = 1;
  pages: number = 0;
  pagesArr: number[] = [];

  @Input('result') searchResult: Recipe[];
  @Output() updateData: EventEmitter<Recipe> = new EventEmitter();

  constructor(
    private favoriteService: FavoriteService,
    public spinner: NgxSpinnerService,
    private snack: SnackService
  ) { }

  ngOnChanges() {
    this.pages = Math.ceil(this.searchResult.length / this.recipePerPage);
    for (let i = 0; i < this.pages; i++) {
      this.pagesArr[i] = i + 1;
    }
    this.showPage();
  }

  showPage(pageNumber: number = 1) {
    this.currentPage = pageNumber;
    const start = (pageNumber - 1) * this.recipePerPage;
    const end = pageNumber * this.recipePerPage;
    this.recipesShowcase = this.searchResult.slice(start, end);
  }

  onSave(recipe: Recipe) {
    const title = recipe.title.length > 20 ? `${recipe.title.slice(0, 20)}...` : recipe.title;

    this.spinner.show();
    this.favoriteService.saveFavorite(recipe)
      .then(() => {
        this.spinner.hide();
        this.snack.success(`The "${title}" Recipe was saved to favorites`);

        this.favoriteService.getFavoriteRecipes().subscribe(res => {
          res.forEach(item => {
            if (item.title === recipe.title) this.updateData.emit(item);
          });
        });
      }).catch(err => {
        this.spinner.hide();
        this.snack.error(`Oops... ${err}`);
      });
  }

  onRemove(id: string) {
    const item = this.searchResult.filter(item => item.id === id)[0];
    const title = item.title.length > 20 ? `${item.title.slice(0, 20)}...` : item.title.slice();

    this.spinner.show();
    this.favoriteService.removeFavorite(id)
      .then(() => {
        this.spinner.hide();
        this.snack.success(`The "${title}" Recipe was removed from favorites`);

        this.updateData.emit({
          f2f_url: item.f2f_url,
          image_url: item.image_url,
          publisher: item.publisher,
          publisher_url: item.publisher_url,
          recipe_id: item.recipe_id,
          social_rank: item.social_rank,
          source_url: item.source_url,
          title: item.title
        });
      }).catch(err => {
        this.spinner.hide();
        this.snack.error(`Oops... ${err}`);
      });
  }
}
