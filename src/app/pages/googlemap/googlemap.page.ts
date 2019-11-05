import { Component, NgZone, ElementRef, ViewChild, Inject, AfterViewInit, OnInit } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
declare const google: any;
@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.page.html',
  styleUrls: ['./googlemap.page.scss'],
})
export class GooglemapPage implements OnInit {

  @ViewChild('map', { static: true }) mapElement: ElementRef;

  map: any;
  latLng: any;

  mapOptions: any;

  places;
  infoWindow;
  markers: any = [];

  MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
  address = {
    address: '',
    locality: '',
    landMark: '',
    state: '',
    city: '',
    distic: '',
    country: '',
    pincode: null,
  };

  addressForm;

  componentForm = {
    street_number: 'long_name',
    sublocality_level_1: 'long_name',
    sublocality_level_2: 'long_name',
    sublocality_level_3: 'long_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'long_name',
    country: 'long_name',
    postal_code: 'short_name'
  };
  restaurantDetails: any = [];
  userUid: any;
  input: any;
  userDetail: any;

  AllUserList: any;




  constructor(
    @Inject(Geolocation) public geolocation: Geolocation,
    @Inject(AngularFirestore) public firestore: AngularFirestore,
    @Inject(Router) private router: Router,
    @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    private storage: Storage,
    @Inject(AlertService) private alertService: AlertService,

  ) {
    this.alertService.showLoader('Google Map is Loading..');
    this.subscribeRouteChanges();
    this.data();
  }


  subscribeRouteChanges() {

    this.activatedRoute.queryParams
      .subscribe((e: Params) => {
        // tslint:disable-next-line: radix

        console.log(e);

        this.userUid = e.user;
        this.getUserById(this.userUid);


      }, (err: any) => {
        this.router.navigate(['/login']);
      });

  }
  getUserById(id) {
    this.firestore.collection('users').doc(id).get().subscribe(doc => {
      console.log(doc.data());
      this.userDetail = doc.data();
      if (this.userDetail.Restaurant.place_id) {
        this.storage.set('placeId', this.restaurantDetails.place_id);
        this.router.navigate(['/welcome'], { queryParams: { user: this.userDetail.uid } });

      }
      if (this.userDetail.Restaurant) {

        this.changeMapHieght('50vh');
        // this.initAutocomplete();


        this.restaurantDetails = this.userDetail.Restaurant;
        this.address = this.restaurantDetails.customAddress;
      } else {
        // this.initAutocomplete();

      }
    }, (error) => {
      this.presentAlert('some went restart the app');
      this.router.navigate(['/login']);

    });
  }


  async presentAlert(mesg) {
    const alert = await this.alertController.create({
      header: 'ERROR',
      // subHeader: 'Subtitle',
      message: mesg,
      buttons: ['OK']
    });

    await alert.present();
  }
  // tslint:disable-next-line: use-lifecycle-interface
  async ngAfterViewInit() {
    // this.loadMap();
    this.geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(position);

      this.mapOptions = {
        center: this.latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: false,
        // scaleControl: false,
        fullscreenControl: false
      };
      this.initAutocomplete();

    }, (err) => {
      console.log(err);

    });


  }



  initAutocomplete() {




    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

    // Create the search box and link it to the UI element.
    this.input = document.getElementById('autocomplete');

    const searchBox = new google.maps.places.SearchBox(document.getElementById('autocomplete'), {
      types: ['(restaurant)'], componentRestrictions: { country: 'In' }
    });
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.input);

    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });
    // searchBox.setComponentRestrictions(}{ 'country': 'in' );
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    this.alertService.closeLoader();
    searchBox.addListener('places_changed', () => {
      this.restaurantDetails = [];

      const places = searchBox.getPlaces();
      this.restaurantDetails = places[0];
      console.log(places);
      if (places.length === 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();


      // Get each component of the address from the place details,
      // and then fill-in the corresponding field on the form.

      for (let i = 0; i < places[0].address_components.length; i++) {
        const addressType = places[0].address_components[i].types[0];
        if (this.componentForm[addressType]) {
          console.log(places[0].address_components[i][this.componentForm[addressType]]);

          if (addressType === 'postal_code') {
            this.address.pincode = places[0].address_components[i][this.componentForm[addressType]] || '';

          }


          if (addressType === 'country') {
            this.address.country = places[0].address_components[i][this.componentForm[addressType]] || '';

          }



          if (addressType === 'administrative_area_level_1') {
            this.address.state = places[0].address_components[i][this.componentForm[addressType]] || '';

          }



          if (addressType === 'locality') {
            this.address.distic = places[0].address_components[i][this.componentForm[addressType]] || '';

          }

          if (addressType === 'street_number') {
            this.address.address = places[0].address_components[i][this.componentForm[addressType]] || '';

          }
          if (addressType === 'route') {
            this.address.landMark = places[0].address_components[i][this.componentForm[addressType]] || '';

          }

          if (addressType === 'neighborhood') {
            this.address.landMark += '  ' + places[0].address_components[i][this.componentForm[addressType]] || '';

          }
          if (addressType === 'sublocality_level_3') {
            this.address.locality = places[0].address_components[i][this.componentForm[addressType]] || '';

          }



          if (addressType === 'sublocality_level_2') {
            this.address.locality += '  ' + places[0].address_components[i][this.componentForm[addressType]];

          }



          if (addressType === 'sublocality_level_1') {
            this.address.city = places[0].address_components[i][this.componentForm[addressType]];

          }

        }
      }
      this.address.address = places[0].vicinity;

      console.log(this.address);
      console.log(this.restaurantDetails);






      places.forEach((place) => {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }
        const Icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: this.map,
          icon: Icon,
          title: place.name,
          position: place.geometry.location
        }));
        const infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(markers, 'click', () => {
          // this.ngZone.run(() => {
          infoWindow.setContent(place.name);
          infoWindow.open(this.map, markers);
        });
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.changeMapHieght('50vh');

      this.map.fitBounds(bounds);
    });

  }

  ngOnInit() {
  }


  changeMapHieght(val) {

    (document.getElementById('map') as HTMLInputElement).style.height = val;

  }







  gotoWelcomPage() {
    // tslint:disable-next-line: no-string-literal
    // debugger;
    if (this.checkRestaurantAlreadyRegisterOrNot() > 0) {
      this.alertService.showErrorAlert('Restaurant Already Register');
      return;
    }
    if (this.address.address.length < 2) {
      this.alertService.showErrorAlert('Please Fill Premise No');
      return;
    }

    if (this.address.locality.length < 2) {
      this.alertService.showErrorAlert('Please Fill Locality');
      return;
    }

    if (this.address.landMark.length < 2) {
      this.alertService.showErrorAlert('Please Fill LandMark');
      return;
    }
    this.restaurantDetails['customAddress'] = this.address;

    this.alertService.showLoader('Please Wait ...');
    this.SetUserData(this.userDetail).then(() => {
      console.log(this.userDetail);
      this.storage.set('placeId', this.restaurantDetails.place_id);

      this.router.navigate(['/welcome'], { queryParams: { user: this.userDetail.uid } });
      this.alertService.closeLoader();

    }, (error) => {
      console.log(error);
      this.alertService.closeLoader();
    });
    // }).catch((error) => {
    //   // this.alertService.showInfoAlert('Error adding document: ');
    //   console.log(error);

    // });
    // }
  }

  SetUserData(userDetails) {
    // const userDetails = JSON.parse(localStorage.getItem('user'));
    // tslint:disable-next-line: no-string-literal
    this.userDetail['Restaurant'] = this.restaurantDetails;
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${userDetails.uid}`);

    return userRef.set(JSON.parse(JSON.stringify(this.userDetail)), {
      merge: true
    });
  }



  getAllUsers(): Observable<any> {
    return this.firestore.collection<any>('users').valueChanges();
  }


  data() {
    this.getAllUsers().subscribe((res) => {
      this.AllUserList = res;
      console.log(res);
    });
  }


  checkRestaurantAlreadyRegisterOrNot() {
    // tslint:disable-next-line: max-line-length
    const arrar1 = this.AllUserList.filter(element => (element.Restaurant && (element.Restaurant.place_id === this.restaurantDetails.place_id)));
    return arrar1.length;
  }




}

