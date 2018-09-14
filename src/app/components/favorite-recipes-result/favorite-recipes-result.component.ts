import { Component, OnChanges, Input } from '@angular/core';
import { Recipe } from "../../models/Recipe";
import { FavoriteService } from "../../services/favorite.service";
import { DialogService } from "../../services/dialog.service";
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
    private dialog: DialogService,
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
        this.spinner.hide();
        this.dialog.success(`Recipe "${titleFormat}" was successfully deleted`, 'All Done!');
      }).catch(err => {
        this.spinner.hide();
        this.dialog.error(`Oops... ${err}`, 'Error!');
      });
  }
}
