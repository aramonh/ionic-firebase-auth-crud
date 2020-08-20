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
  posts: any;
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
    this.getPosts();
  }

  salir(){
    this.authCtrl.signOut();
  }

  async getPosts() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    (await loader).present();
    try {
      this.firestore
        .collection('posts')
        .snapshotChanges()
        .subscribe((data) => {
          // console.log(data);
          this.posts = data.map((e) => {
            // console.log('map data', e);
            return {
              id: e.payload.doc.id,
              // tslint:disable-next-line: no-string-literal
              title: e.payload.doc.data()['title'],
              // tslint:disable-next-line: no-string-literal
              details: e.payload.doc.data()['details'],
            };
          });
        });
    } catch (er) {
      this.showToast(er);
    }
    // dismiss loader
    (await loader).dismiss();
  }

  async deletePost(id: string) {
    // show loader
    console.log('Delete', id);
    const loader = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    (await loader).present();
    try {
     // await this.firestore.doc('posts' + id).delete();
    await this.firestore.collection('posts').doc(id).delete();
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
        duration: 2000,
      })
      .then((toastData) => toastData.present());
  }
}
