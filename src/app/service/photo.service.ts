import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}
@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  photoList: any;

  constructor(private camera: Camera, private storage: Storage) {
    this.photoList = {
      indoorSpace: [] = [],
      outdoorSpace: [] = [],
      food: [] = [],
      menuPhoto: [] = [],
    };
    console.log(this.photoList);

  }

  takePicture(options, imgTypeName) {

    console.log('image type');
    console.log(imgTypeName);
    console.log(this.photoList);
    console.log(this.photoList[imgTypeName]);

    this.camera.getPicture(options).then((imageData) => {
      // Add new photo to gallery
      // console.log(this.photoList.[imgTypeName]);
      console.log(this.photoList);
      if (imgTypeName === 'indoorSpace') {
        this.photoList.indoorSpace.push({
          data: 'data:image/jpeg;base64,' + imageData,
          name: this.getName(imgTypeName)
        });
        this.storage.set('photos', this.photoList);
        console.log('save in local');
      } else {

        if (imgTypeName === 'outdoorSpace') {
          this.photoList.outdoorSpace.push({
            data: 'data:image/jpeg;base64,' + imageData,
            name: this.getName(imgTypeName)
          });
          this.storage.set('photos', this.photoList);
          console.log('save in local');
        } else {

          if (imgTypeName === 'food') {
            this.photoList.food.push({
              data: 'data:image/jpeg;base64,' + imageData,
              name: this.getName(imgTypeName)
            });
            this.storage.set('photos', this.photoList);
            console.log('save in local');
          } else {
            if (imgTypeName === 'menuPhoto') {
              this.photoList.menuPhoto.push({
                data: 'data:image/jpeg;base64,' + imageData,
                name: this.getName(imgTypeName)
              });
              this.storage.set('photos', this.photoList);
              console.log('save in local');
            }
          }

        }



      }
    }, (err) => {
      // Handle error
      console.log('Camera issue: ' + err);
    });

  }

  takePictureFromGalry(imgTypeName) {
    const options: CameraOptions = {
      quality: 60,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 400,
      targetHeight: 400,
      allowEdit: true
    };
    this.takePicture(options, imgTypeName);
  }
  takePictureFromCamera(imgTypeName) {
    console.log(imgTypeName);

    const options: CameraOptions = {
      quality: 60,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 400,
      targetHeight: 400,
      allowEdit: true
    };
    this.takePicture(options, imgTypeName);
  }
  removePicture(imgTypeName, data) {

    if (imgTypeName === 'indoorSpace') {
      this.photoList.indoorSpace.splice(this.photoList.indoorSpace.indexOf(data), 1);
      this.storage.set('photos', this.photoList);
      console.log('remove');
    } else {

      if (imgTypeName === 'outdoorSpace') {
        this.photoList.outdoorSpace.splice(this.photoList.outdoorSpace.indexOf(data), 1);
        this.storage.set('photos', this.photoList);
        console.log('remove');
      } else {

        if (imgTypeName === 'food') {
          this.photoList.food.splice(this.photoList.food.indexOf(data), 1);
          this.storage.set('photos', this.photoList);
          console.log('remove');
        } else {
          if (imgTypeName === 'menuPhoto') {
            this.photoList.menuPhoto.splice(this.photoList.menuPhoto.indexOf(data), 1);
            this.storage.set('photos', this.photoList);
            console.log('remove');
          }
        }

      }
    }








    this.loadSaved();
  }

  loadSaved() {
    this.storage.get('photos').then((photos) => {
      this.photoList = photos || this.photoList;
      console.log('list of photo');
      console.log(this.photoList);


    });
  }


  getName(val: string) {
    const name = val + (new Date()).getTime().toString();
    return name;
  }
}

class Photo {
  data: any;
  name: string;
}
// class PhotoArray {
//   indoorSpace: Photo[] = [];
//   outdoorSpace: Photo[] = [];
//   food: Photo[] = [];
//   menuPhoto: Photo[] = [];
// }
