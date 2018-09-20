import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchService } from "../../services/search.service";
import { FormControl, FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { FavoriteService } from "../../services/favorite.service";
import { SnackService } from "../../services/snack.service";
import { SaveHistoryService } from "../../services/save-history.service";
import { Observable } from "rxjs";
import { Recipe } from "../../models/Recipe";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  searchHistory = [];
  filteredOptions: Observable<string[]>;
  saveSearch: boolean = false;

  @Output() getData: EventEmitter<Recipe[]> = new EventEmitter();

  constructor(
    private searchService: SearchService,
    public spinner: NgxSpinnerService,
    private snack: SnackService,
    private favoriteService: FavoriteService,
    private saveHistoryService: SaveHistoryService
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      name: new FormControl('')
    });

    this.searchService.getSearchHistory().subscribe(res => this.searchHistory = res);
    this.filteredOptions = this.searchForm.get('name').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.saveHistoryService.historyStateExp.subscribe(state => this.saveSearch = state);
  }

  onSearch() {
    this.spinner.show();

    this.searchService.searchRecipe(this.searchForm.value.name).subscribe(res => {
      this.favoriteService.getFavoriteRecipes().subscribe(favorites => {
        this.getData.emit(res.map(item => {
          for (let recipe of favorites) {
            if (item.title === recipe.title) item.id = recipe.id;
          }
          return item;
        }));
      });

      const name = this.searchForm.value.name;
      if (this.saveSearch) {
        if (this.searchHistory.some(item => item.name === name) || !name) return;
        this.searchService.saveSearchHistory(this.searchForm.value.name);
      }
    }, err => {
      this.snack.error(`Oops... ${err}`);
    }, () => {
      this.spinner.hide();
      this.searchForm.patchValue({ name: '' });
    });
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.searchHistory.filter(item => item.name.toLowerCase().includes(filterValue));
  }
}
