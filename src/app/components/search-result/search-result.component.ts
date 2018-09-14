import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from "../../models/Recipe";
import { FavoriteService } from "../../services/favorite.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnChanges {

  @Input('result') searchResult: Recipe[];
  @Output() updateData: EventEmitter<Recipe> = new EventEmitter();

  constructor(
    private favoriteService: FavoriteService,
    private dialog: DialogService,
    public spinner: NgxSpinnerService
  ) { }

  ngOnChanges() {
  }

  onSave(recipe: Recipe) {
    const title = recipe.title.length > 20 ? `${recipe.title.slice(0, 20)}...` : recipe.title;

    this.spinner.show();
    this.favoriteService.saveFavorite(recipe)
      .then(() => {
        this.spinner.hide();
        this.dialog.success(`Recipe "${title}" was added to favorites`, 'Success!');

        this.favoriteService.getFavoriteRecipes().subscribe(res => {
          res.forEach(item => {
            if (item.title === recipe.title) this.updateData.emit(item);
          });
        });
      }).catch(err => {
        this.spinner.hide();
        this.dialog.error(`Oops... ${err}`, 'Error!');
      });
  }

  onRemove(id: string) {
    const item = this.searchResult.filter(item => item.id === id)[0];
    const title = item.title.length > 20 ? `${item.title.slice(0, 20)}...` : item.title.slice();

    this.spinner.show();
    this.favoriteService.removeFavorite(id)
      .then(() => {
        this.spinner.hide();
        this.dialog.success(`Recipe "${title}" was successfully deleted`, 'All Done!');

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
        this.dialog.error(`Oops... ${err}`, 'Error!');
      });
  }
}
