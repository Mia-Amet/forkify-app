import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AngularFireModule } from "angularfire2"
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core"
// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_DIALOG_DEFAULT_OPTIONS, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatToolbarModule } from "@angular/material";
import { MatAutocompleteModule } from "@angular/material";
import { MatSlideToggleModule } from "@angular/material";
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from "@angular/material";
import { MatDialogModule } from "@angular/material";
import { MatMenuModule } from "@angular/material";
// Environment
import { environment } from "../environments/environment";
// My modules
import { AppRoutingModule } from "./app-routing.module";
// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchComponent } from './components/search/search.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { FavoriteRecipesComponent } from './components/favorite-recipes/favorite-recipes.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AboutComponent } from './components/about/about.component';
import { FavoriteRecipesResultComponent } from './components/favorite-recipes-result/favorite-recipes-result.component';
import { SnackComponent } from './components/snack/snack.component';
// Directives
import { OpacityDirective } from "./directives/opacity.directive";
import { SettingsComponent } from './components/settings/settings.component';
import { LinkBtnDirective } from './directives/link-btn.directive';
import { LayoutBtnDirective } from './directives/layout-btn.directive';
import { ColorDirective } from './directives/color.directive';
// Helpers
import { HttpLoaderFactory } from "./helpers/translateFactory";
import { SwitchLanguageService } from "./services/switch-language.service";
import { AuthGuard } from "./guards/auth.guard";
import {AuthService} from "./services/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    ResetPasswordComponent,
    OpacityDirective,
    NavbarComponent,
    SearchComponent,
    SearchResultComponent,
    FavoriteRecipesComponent,
    NotFoundComponent,
    AboutComponent,
    FavoriteRecipesResultComponent,
    SettingsComponent,
    SnackComponent,
    LinkBtnDirective,
    LayoutBtnDirective,
    ColorDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    NgxSpinnerModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: {
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    }
  }, {
    provide: MAT_DIALOG_DEFAULT_OPTIONS,
    useValue: {
      hasBackdrop: true,
      id: 'userSettings',
      panelClass: 'settingsContainer',
      width: '340px',
      height: 'auto',
      position: {
        top: '64px',
        right: '0px'
      }
    }
  },
    SwitchLanguageService,
    AuthService,
    AuthGuard
  ],
  entryComponents: [SnackComponent, SettingsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
