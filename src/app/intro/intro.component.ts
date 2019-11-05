import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { IonSlides } from '@ionic/angular';
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit {
  slidesOpts = {
    initialSlide: 1,
    speed: 400

  };
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  constructor(private storage: Storage, private router: Router) { }
  next() {
    this.slides.slideNext();
  }


  ngOnInit() { }
  async finish() {
    await this.storage.set('tutorialComplete', true);
    this.router.navigateByUrl('/login');
  }

}
