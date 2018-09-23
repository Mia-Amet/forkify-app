import { Component, OnChanges, Input, ViewChild } from '@angular/core';
import { Observable } from "rxjs";
import { ShoppingList } from "../../models/ShoppingList";
import { ShoppingListService } from "../../services/shopping-list.service";
import { MatListOption, MatSelectionList } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { SnackService } from "../../services/snack.service";
import { RecipeExt } from "../../models/Recipe";

@Component({
  selector: 'app-recipe-ingredients',
  templateUrl: './recipe-ingredients.component.html',
  styleUrls: ['./recipe-ingredients.component.scss']
})
export class RecipeIngredientsComponent implements OnChanges {
  selectAll: boolean = false;
  shoppingList: ShoppingList | null;
  options: MatListOption[];
  private _ingredientsList: string[];

  @ViewChild('ingredients') select: MatSelectionList;
  @Input('ingredientsList') ingredientsList: Observable<string[]>;
  @Input('recipe') recipe: RecipeExt;
  @Input('id') id: string;

  constructor(
    private shoppingListService: ShoppingListService,
    private snack: SnackService,
    public spinner: NgxSpinnerService
  ) { }

  ngOnChanges() {
    this.shoppingListService.getShoppingList().subscribe((res: ShoppingList[]) => {
      localStorage.setItem('shoppingList', JSON.stringify(res));
    });
    this.shoppingList = JSON.parse(localStorage.getItem('shoppingList'));
  }

  isSelected(option: string): boolean {
    return this.shoppingList.ingredients.some(item => item.includes(option));
  }

  onAddIngredients(): void {
    const ingredients: string[] = this.select.selectedOptions.selected.map(value => value.getLabel());
    const today: number = Date.now();
    const list: ShoppingList = {
      title: this.recipe.title,
      source_url: this.recipe.source_url,
      add_date: today,
      recipe_id: this.id,
      ingredients
    };

    this.spinner.show();
    this.shoppingListService.saveShoppingList(list)
      .then(res => {
        this.snack.success(`Shopping list was updated successfully`);
        this.select.deselectAll();
        this.selectAll = false;
      }).catch(err => this.snack.error(`Oops... ${err}`));
    this.spinner.hide();
  }
}
