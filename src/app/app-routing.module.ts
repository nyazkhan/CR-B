import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';
import { IntroComponent } from './intro/intro.component';
import { LoginGuard } from './guards/login.guard';
import { MapGuard } from './guards/map.guard';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: 'intro', component: IntroComponent , canActivate: [IntroGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' , canActivate: [LoginGuard]},
  { path: 'thankyou', loadChildren: './signup/signup.module#SignupPageModule' },
  // { path: 'forgot', loadChildren: './forgot/forgot.module#ForgotPageModule' },
  { path: 'welcome', loadChildren: './pages/welcome/welcome.module#WelcomePageModule' },
  { path: 'googlemap', loadChildren: './pages/googlemap/googlemap.module#GooglemapPageModule', canActivate: [MapGuard] },
  { path: '**', redirectTo: '/login' },
//  { path: 'camera', loadChildren: './pages/camera/camera.module#CameraPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
