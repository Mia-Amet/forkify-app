import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AngularFireModule } from "angularfire2"
import { AngularFireAuthModule } from "angularfire2/auth";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

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
import { DialogComponent } from "./components/dialog/dialog.component";
// Directives
import { OpacityDirective } from "./directives/opacity.directive";
import {AngularFireDatabaseModule} from "angularfire2/database";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    ResetPasswordComponent,
    DialogComponent,
    OpacityDirective
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
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule
  ],
  providers: [],
  entryComponents: [DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
