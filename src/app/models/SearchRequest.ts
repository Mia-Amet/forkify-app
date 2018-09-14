import {Recipe} from "./Recipe";

export interface SearchRequest {
  count: number;
  recipes: Recipe[];
}
