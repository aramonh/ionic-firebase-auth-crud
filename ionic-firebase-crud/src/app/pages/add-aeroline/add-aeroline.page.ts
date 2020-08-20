import { Component, OnInit } from '@angular/core';
import { Aeroline } from '../../interfaces/interfaces';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-aeroline',
  templateUrl: './add-aeroline.page.html',
  styleUrls: ['./add-aeroline.page.scss'],
})
export class AddAerolinePage implements OnInit {

  aeroline: Aeroline = {
    name: '',
    location: '',
    details: '',
    airplanes: 0
  };
    constructor(private toastCtrl: ToastController,
                private loadingCtrl: LoadingController,
                private firestore: AngularFirestore,
                private navCtrl: NavController,
                private authCtrl: AuthService) { }

    ngOnInit() {
      if (!this.authCtrl.logIn){
        this.navCtrl.navigateRoot('login');
        this.showToast('Do Login');
      }
    }



    async createAeroline(aeroline: Aeroline){
      console.log('aeroline to create', aeroline);
      if (this.formValidation()){
        // show loader
        const loader = this.loadingCtrl.create({
          message: 'Please Wait...'
        });
        (await loader).present();

        try {
          await this.firestore.collection('aerolines').add(aeroline)
          .then( data => {
            console.log('created', data);
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
