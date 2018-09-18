import { Component, OnChanges, Input } from '@angular/core';
import { Recipe } from "../../models/Recipe";
import { FavoriteService } from "../../services/favorite.service";
import { SnackService } from "../../services/snack.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-favorite-recipes-result',
  templateUrl: './favorite-recipes-result.component.html',
  styleUrls: ['./favorite-recipes-result.component.scss']
})
export class FavoriteRecipesResultComponent implements OnChanges {

  @Input('favorites') favoriteRecipes: Recipe[];

  constructor(
    private favoriteService: FavoriteService,
    private snack: SnackService,
    public spinner: NgxSpinnerService
  ) { }

  ngOnChanges() {
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
