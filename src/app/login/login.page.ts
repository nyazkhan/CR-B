import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController, IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
// import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AlertService } from '../service/alert.service';

export interface User {
  uid: string;

  phone: number;
  email: string;
  emailVerified: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  phoneNo = '';
  error = null;
  public PASSWORD_REGEX = '[789][0-9]{9}';
  @ViewChild('recaptchacontainer', { static: false }) recaptcha: ElementRef;
  varificationId: any;
  recaptchaVerifier: any;

  confirmationResult: firebase.auth.ConfirmationResult;
  isApp: boolean;
  otp: string;
  phone: string;
  code: string;

  UserId: string;
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  constructor(
    @Inject(AngularFireAuth) public angularFire: AngularFireAuth,
    @Inject(AlertService) private alertService: AlertService,
    @Inject(Router) private router: Router,
    private toastController: ToastController,
    private storage: Storage,

    @Inject(AngularFirestore) public afs: AngularFirestore,   // Inject Firestore service
  ) {


    this.angularFire.authState.subscribe((user) => {
      if (user) {
        this.storage.set('userId', user.uid);
        // this.router.navigate(['/googlemap'], { queryParams: { user: user.uid } });

      } else {
        this.storage.set('userId', null);
      }

    }, (error) => {

    });



  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  previous() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }



  phoneValidation() {

    const regExp = /^\d{10}$/;
    console.log(this.phoneNo);

    if (!regExp.test(this.phoneNo)) {
      this.error = ' Please enter a valid Phone No';
      console.log(this.error);

      return { invalidMobile: true };
    }
    console.log('invalidno');
    this.error = null;
    console.log(this.error);

    return null;
  }

  isValidPhone() {
    const reg = /^\d{10}$/;

    if (reg.test(this.phoneNo) === false) {
      // alert('Invalid Email Address');
      return false;
    }

    return true;

  }


  onSignInSubmit() {
    console.log('its call');
    if (this.phoneNo === '') {
      this.alertService.showErrorAlert('Please Enter Mobile No');
      return;
    }
    if (!this.isValidPhone()) {
      this.alertService.showErrorAlert('Please Enter Valid Mobile No');
      return;
    }

    this.alertService.showLoader('OTP sending..');
    const appVerifier = this.recaptchaVerifier;
    const no = '+91' + this.phoneNo;
    this.angularFire.auth.signInWithPhoneNumber(no, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResult = confirmationResult;
        // const code = window.prompt('Please enter your code');
        // return confirmationResult.confirm(code);
        this.next();
        this.alertService.closeLoader();


      }).catch((error) => {
        // Error; SMS not sent
        // ...
        this.alertService.closeLoader();

        // appVerifier.verify();
        appVerifier.reset();
        // this.previous();
        this.alertService.showErrorAlert(error.code);
        console.log(error);
        // this.router.navigate(['/login']);

      });
  }

  isValidNumber(event) {
    console.log(/\d|Backspace/.test(event.key));

    return /\d|Backspace/.test(event.key);

  }
  otpSummit() {
    this.alertService.showLoader(' Verifying OTP ..');

    this.confirmationResult.confirm(this.otp).then((result) => {
      // User signed in successfully.
      console.log(result.user);
      this.SetUserData(result.user).then(() => {
        this.alertService.closeLoader();

        this.storage.set('user', result.user);

        this.next();
        this.UserId = result.user.uid;
        // this.router.navigate(['/googlemap'], { queryParams: { user: result.user.uid } });
      });
      // ...

      // this.router.navigate(['/googlemap']);

    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
      this.alertService.closeLoader();
      this.alertService.showErrorAlert('wrong OTP ');
    });
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {

      uid: user.uid,
      phone: user.phoneNumber,
      emailVerified: user.emailVerified,
      email: user.email,

    };
    return userRef.set(userData, {
      merge: true
    });
  }

  ionViewDidEnter() {
    // this.angularFire.auth.settings.appVerificationDisabledForTesting = true;

    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha',
      {
        size: 'invisible', callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // this.onSignInSubmit();
        }, 'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
          console.log('wrong no error');

        }
      });


  }

  ngOnInit() {

  }
  goToMap() {

    this.slides.slideTo(0, 1000);
    this.router.navigate(['/googlemap'], { queryParams: { user: this.UserId } });

  }


  ionViewDidLeave() {
  }

  signOut() {
    this.angularFire.auth.signOut().then(() => {
      // Sign-out successful.
      this.router.navigate(['/login']);
    }).catch((error) => {
      // An error happened.
    });
  }


}
