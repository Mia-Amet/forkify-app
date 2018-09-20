import { Component, OnInit } from '@angular/core';
import { RecipeService } from "../../services/recipe.service";
import { FavoriteService } from "../../services/favorite.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SnackService } from "../../services/snack.service";
import { FakeRecipe } from "../../helpers/fakeRecipe"
import { Location } from "@angular/common";
import { RecipeDetail, RecipeExt, RequestRecipe } from "../../models/Recipe";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  id: string;
  recipe: RecipeExt;
  ingredientsList: Observable<string[]>;
  description: Observable<string>;
  cookProcess: string[];
  index: number;
  recipeInfo: RequestRecipe;
  private currentList: RequestRecipe[];

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    public spinner: NgxSpinnerService,
    private faker: FakeRecipe,
    private location: Location,
    private favoriteService: FavoriteService,
    private snack: SnackService
  ) { }

  ngOnInit() {
    this.router.onSameUrlNavigation = 'reload';
    this.index = this.route.snapshot.queryParams['i'];
    this.id = this.route.snapshot.params['id'];
    this.cookProcess = this.faker.cookProcess;

    this.getRecipeInfo()
      .then(res => this.recipeInfo = res)
      .catch(err => console.log(err));
    this.getRecipe(this.id);
  }

  async getRecipeInfo() {
    let recipe: RequestRecipe;
    await this.recipeService.listState.pipe(
      map(res => res.map((recipe: RecipeExt, index) => {
        return {
          recipe_id: recipe.recipe_id,
          next_id: index < res.length - 1 ? res[index + 1].recipe_id : null,
          prev_id: index > 0 ? res[index - 1].recipe_id : null
        }
      }))
    ).subscribe(res => this.currentList = res);
    recipe = await this.currentList[this.index];
    return await recipe;
  }

  getRecipe(id: string): void {
    this.spinner.show();
    this.recipeService.getRecipe(id).subscribe((res: RecipeDetail) => {
      if (res) {
        this.recipe = res.recipe;
        this.ingredientsList = new Observable(observer => observer.next(res.recipe.ingredients));
        this.description = new Observable(observer => observer.next(this.faker.getDescription(res.recipe.title)));
      }
    }, err => console.log(err),
      () => {
        this.favoriteService.getFavoriteRecipes().subscribe(res => res.forEach(recipe => {
          if (recipe.recipe_id === this.id) this.recipe.id = recipe.id;
        }));
        this.spinner.hide();
      });
  }

  onGoBack(): void {
    this.location.back();
  }

  onNext(id: string): void {
    this.router.navigate([`/recipes/${id}`], {queryParams: { i: +this.index + 1 }})
      .then(() => {
        this.ngOnInit();
      });
  }

  onPrev(id: string): void {
    this.router.navigate([`/recipes/${id}`], {queryParams: { i: +this.index - 1 }})
      .then(() => {
        this.ngOnInit();
      });
  }

  onSave(): void {
    const title = this.recipe.title.length > 20 ? `${this.recipe.title.slice(0, 20)}...` : this.recipe.title;

    this.spinner.show();
    this.favoriteService.saveFavorite(this.recipe)
      .then(res => {
        this.snack.success(`The "${title}" Recipe was saved to favorites`);
        this.recipe.id = res.id;
      }).catch(err => this.snack.error(`Oops... ${err}`));
    this.spinner.hide();
  }

  onRemove() {
    const title = this.recipe.title.length > 20 ? `${this.recipe.title.slice(0, 20)}...` : this.recipe.title.slice();

    this.spinner.show();
    this.favoriteService.removeFavorite(this.recipe.id)
      .then(() => {
        this.snack.success(`The "${title}" Recipe was removed from favorites`);
        delete this.recipe.id;
      }).catch(err => this.snack.error(`Oops... ${err}`));
    this.spinner.hide();
  }
}
