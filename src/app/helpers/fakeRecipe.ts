import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class FakeRecipe {
  private _description: string = `
    A jalapeno popper inspired grilled RECIPE_TITLE with roasted jalapeno peppers, cream cheese, 
    jack & cheddar cheese and crumbled tortilla chips for a bit of crunch.`;
  cookProcess: string[] = [
    'Place the peppers on a baking sheet with the cut side facing down.',
    'Place the baking sheet on the top shelf in the oven and broil until the outer layer of the skin has blackened, about 8-14 minutes.',
    'Place the peppers in a zip-lock bag or other sealable container, seal and let them cool until you can handle them, about 20 minutes.',
    'Remove the skins from the peppers. The skins should easily “pinch” off.',
    'Butter the outside of each slice of bread and spread the cream cheese on the inside. Sprinkle half of the cheese on the cream cheese of one slice of bread, top with the jalapenos, crumbled tortilla chips, the remaining cheese and finally the other slice of bread.',
    'Heat a non-stick pan over medium heat.',
    'Add the sandwich and grill until golden brown and the cheese has melted, about 2-4 minutes per side.'
  ];
  cookTime: number = 2400000;
  servings: number = 2;

  public getDescription(name: string): string {
    return this._description.replace( /RECIPE_TITLE/g, name );
  }
}
