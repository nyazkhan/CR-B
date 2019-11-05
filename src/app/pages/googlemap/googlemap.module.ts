import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GooglemapPage } from './googlemap.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PopoverPage } from './address-popover/address-popover';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

const routes: Routes = [
  {
    path: '',
    component: GooglemapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularFirestoreModule,
    AngularFireAuthModule,

    RouterModule.forChild(routes)
  ],
  declarations: [GooglemapPage, PopoverPage],
  entryComponents: [PopoverPage],
  providers: [Geolocation],
})
export class GooglemapPageModule { }
