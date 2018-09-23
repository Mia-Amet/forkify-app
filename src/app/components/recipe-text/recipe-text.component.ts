import { Component, OnInit, Input } from '@angular/core';
import { FakeRecipe } from "../../helpers/fakeRecipe"
import { Observable } from "rxjs";

@Component({
  selector: 'app-recipe-text',
  templateUrl: './recipe-text.component.html',
  styleUrls: ['./recipe-text.component.scss']
})
export class RecipeTextComponent implements OnInit {
  cookProcess: string[];

  @Input('description') description: Observable<string>;

  constructor(
    private faker: FakeRecipe
  ) { }

  ngOnInit() {
    this.cookProcess = this.faker.cookProcess;
  }

}
