import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  loading: any;
  isLoading = false;

  constructor(
    public alertController: AlertController,
    public loader: LoadingController,
    public toastController: ToastController
  ) { }

  async showErrorAlert(msg: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }





  async showInfoAlert(msg: string) {
    const confrm = await this.alertController.create({
      header: 'Success',
      message: msg,
    });

    await confrm.present();
  }



  async showLoader(text?: string) {
    console.log('show loder');
    this.isLoading = true;
    // this.loading = await this.loader.create({
    //   message: text || '',

    // });
    // return await this.loading.present().then(() => {
    //   console.log('presented');
    //   if (!this.isLoading) {
    //    this.loading.dismiss().then(() => console.log('abort presenting'));
    //   }
    // });
    return await this.loader.create({
      message: text || '',
  }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });

  }


  async closeLoader() {
    console.log('hide it');
    this.isLoading = false;

    return await this.loader.dismiss();
    // this.loading.dismiss();

  }
}

