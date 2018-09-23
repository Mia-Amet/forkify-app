import { Component, OnInit } from '@angular/core';
import { RecipeService } from "../../services/recipe.service";
import { FavoriteService } from "../../services/favorite.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SnackService } from "../../services/snack.service";
import { DialogService } from "../../services/dialog.service";
import { FakeRecipe } from "../../helpers/fakeRecipe"
import { Location } from "@angular/common";
import { RecipeExt, RequestRecipe } from "../../models/Recipe";
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
    private snack: SnackService,
    private dialog: DialogService
  ) { }

  ngOnInit() {
    this.router.onSameUrlNavigation = 'reload';
    this.index = this.route.snapshot.queryParams['i'];
    this.id = this.route.snapshot.params['id'];

    this.getRecipeInfo()
      .then(res => this.recipeInfo = res)
      .catch(err => console.log(err));
    this.getRecipe(this.id);
  }

  async getRecipeInfo(): Promise<RequestRecipe> {
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
    this.recipeService.getRecipe(id).subscribe((res: RecipeExt) => {
      if (res) {
        this.recipe = res;
        this.ingredientsList = new Observable(observer => observer.next(res.ingredients));
        this.description = new Observable(observer => observer.next(this.faker.getDescription(res.title)));
      }
    }, err => console.log(err), () => {
      this.favoriteService.getFavoriteRecipes().subscribe(res => res.forEach(recipe => {
        if (recipe.recipe_id === this.id) this.recipe.id = recipe.id;
      }));
      this.spinner.hide();
    });
  }

  onGoBack(): void {
    this.location.back();
    if (/\/recipes/.test(this.router.url)) this.ngOnInit();
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
    const title: string = this.recipe.title.length > 20 ? `${this.recipe.title.slice(0, 20)}...` : this.recipe.title;

    this.spinner.show();
    this.favoriteService.saveFavorite(this.recipe)
      .then(res => {
        this.snack.success(`The "${title}" Recipe was saved to favorites`);
        this.recipe.id = res.id;
      }).catch(err => this.snack.error(`Oops... ${err}`));
    this.spinner.hide();
  }

  onRemove() {
    const title: string = this.recipe.title.length > 20 ? `${this.recipe.title.slice(0, 20)}...` : this.recipe.title.slice();
    const text: string = 'Are you sure you want to remove this recipe from favorites?';

    this.dialog.openDialog(this.recipe.id, title, text).subscribe((res: boolean) => {
      if (res) {
        this.spinner.show();
        this.favoriteService.removeFavorite(this.recipe.id)
          .then(() => {
            let homeCollection = JSON.parse(localStorage.getItem('homeCollection')).map(item => {
              if (item.id === this.recipe.id) delete item.id;
              return item;
            });
            localStorage.setItem('homeCollection', JSON.stringify(homeCollection));
            delete this.recipe.id;
          }).then(() => {
            this.spinner.hide();
            this.snack.success(`The "${title}" Recipe was removed from favorites`);
          }).catch(err => {
            this.spinner.hide();
            this.snack.error(`Oops... ${err}`)
          });
      }
    });
  }
}
