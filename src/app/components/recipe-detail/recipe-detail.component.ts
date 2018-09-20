import { Component, OnInit } from '@angular/core';
import { RecipeService } from "../../services/recipe.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Recipe, RecipeDetail, RecipeExt, RequestRecipe } from "../../models/Recipe";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { FakeRecipe } from "../../helpers/fakeRecipe"
import { Location } from "@angular/common";
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
    private location: Location
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
      () => this.spinner.hide());
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

  onSave(recipe: Recipe) {
  }

  onRemove(id: string) {
  }
}
