export interface Recipe {
  f2f_url: string;
  image_url: string;
  publisher: string;
  publisher_url: string;
  recipe_id: string;
  social_rank: number;
  source_url: string;
  title: string;
  id?: string;
}

export interface RecipeExt extends Recipe {
  ingredients: string[];
}

export interface RequestRecipe {
  recipe_id: string;
  next_id: string | null;
  prev_id: string | null;
}

