import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ToastController,
  NavController,
} from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  aerolines: any;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private authCtrl: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit(){
    if (!this.authCtrl.logIn){
      this.navCtrl.navigateRoot('login');
      this.showToast('Do Login');
    }
  }

  ionViewWillEnter() {
    this.getAerolines();
  }

  salir(){
    this.authCtrl.signOut();
  }

  async getAerolines() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    (await loader).present();
    try {
      this.firestore
        .collection('aerolines')
        .snapshotChanges()
        .subscribe((data) => {
          // console.log(data);
          this.aerolines = data.map((e) => {
            // console.log('map data', e);
            return {
              id: e.payload.doc.id,
              // tslint:disable-next-line: no-string-literal
              name: e.payload.doc.data()['name'],
              // tslint:disable-next-line: no-string-literal
              location: e.payload.doc.data()['location'],
              // tslint:disable-next-line: no-string-literal
              details: e.payload.doc.data()['details'],
              // tslint:disable-next-line: no-string-literal
              airplanes: e.payload.doc.data()['airplanes'],
            };
          });
        });
    } catch (er) {
      this.showToast(er);
    }
    // dismiss loader
    (await loader).dismiss();
  }

  async deleteAeroline(id: string) {
    // show loader
    console.log('Delete', id);
    const loader = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    (await loader).present();
    try {
     // await this.firestore.doc('aerolines' + id).delete();
    await this.firestore.collection('aerolines').doc(id).delete();
    } catch (er) {
      this.showToast(er);
    }
    (await loader).dismiss();
  }

  showToast(message: string) {
    console.log(message);
    this.toastCtrl
      .create({
        message,
        duration: 3000,
      })
      .then((toastData) => toastData.present());
  }
}
