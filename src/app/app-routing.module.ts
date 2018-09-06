import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { AuthGuard } from "./guards/auth.guard";

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'reset-password', component: ResetPasswordComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
