import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchService } from "../../services/search.service";
import { FormControl, FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Recipe } from "../../models/Recipe";
import { DialogService } from "../../services/dialog.service";
import { FavoriteService } from "../../services/favorite.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  searchHistory = [];
  filteredOptions: Observable<string[]>;

  @Output() getData: EventEmitter<Recipe[]> = new EventEmitter();

  constructor(
    private searchService: SearchService,
    public spinner: NgxSpinnerService,
    private dialog: DialogService,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      name: new FormControl(''),
      save: new FormControl(false)
    });

    this.searchService.getSearchHistory().subscribe(res => this.searchHistory = res);
    this.filteredOptions = this.searchForm.get('name').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
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

      if (this.searchForm.value.save) {
        if (this.searchHistory.some(item => item.name === this.searchForm.value.name)) return;
        this.searchService.saveSearchHistory(this.searchForm.value.name);
      }
    }, err => {
      this.dialog.error(`Oops... ${err}`, 'Error!');
    }, () => {
      this.spinner.hide();
      this.searchForm.patchValue({ name: '', save: false });
    });
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.searchHistory.filter(item => item.name.toLowerCase().includes(filterValue));
  }
}
