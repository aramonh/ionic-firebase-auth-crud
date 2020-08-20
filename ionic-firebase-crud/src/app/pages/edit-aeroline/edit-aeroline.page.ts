import { Component, OnInit } from '@angular/core';
import { Aeroline } from '../../interfaces/interfaces';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-aeroline',
  templateUrl: './edit-aeroline.page.html',
  styleUrls: ['./edit-aeroline.page.scss'],
})
export class EditAerolinePage implements OnInit {
  aeroline: Aeroline = {
    name: '',
    location: '',
    details: '',
    airplanes: 0
  };
  id: any;
  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private firestore: AngularFirestore,
              private navCtrl: NavController,
              private actRoute: ActivatedRoute,
              private authCtrl: AuthService) {

    // get id of home
    this.id = this.actRoute.snapshot.paramMap.get('id');
   }

  ngOnInit() {
    if (!this.authCtrl.logIn){
      this.navCtrl.navigateRoot('login');
      this.showToast('Do Login');
    }else{
      this.getAerolineById(this.id);
    }
  }

  async getAerolineById(id: string){
      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Please Wait...'
      });
      (await loader).present();

      try {
        this.firestore.doc('aerolines/' + id )
        .valueChanges()
        .subscribe( data => {
          // tslint:disable-next-line: no-string-literal
          this.aeroline.name = data['name'];
          // tslint:disable-next-line: no-string-literal
          this.aeroline.location = data['location'];
          // tslint:disable-next-line: no-string-literal
          this.aeroline.details = data['details'];
          // tslint:disable-next-line: no-string-literal
          this.aeroline.airplanes = data['airplanes'];
        });

    } catch (er) {
      this.showToast(er);

    }
      // dismiss loader
      (await loader).dismiss();
  }

  async updateAeroline(aeroline: Aeroline){
    if (this.formValidation()){
      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Please Wait...'
      });
      (await loader).present();

      try {
        await this.firestore.collection('aerolines').doc(this.id).update(aeroline).then( data => {
          console.log('updated', data);
        });
      } catch (er) {
        this.showToast(er);
      }
      // dismiss loader
      (await loader).dismiss();
      // redirect to home page
      this.navCtrl.navigateRoot('home');
    }
  }



  formValidation(){
    if (!this.aeroline.name ){
      this.showToast('Enter Name');
      return false;
    }
    if (!this.aeroline.airplanes ){
      this.showToast('Enter number of airplanes');
      return false;
    }
    if (!this.aeroline.location ){
      this.showToast('Enter Location');
      return false;
    }
    if (!this.aeroline.details ){
      this.showToast('Enter Details');
      return false;
    }
    return true;
  }

  showToast(message: string){
    console.log(message);
    this.toastCtrl.create({
      message,
      duration: 3000
    }).then(
      toastData => toastData.present()
    );
  }



}
