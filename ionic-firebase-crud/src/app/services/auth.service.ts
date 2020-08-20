import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  NavController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { User } from '../interfaces/interfaces';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  public get logIn(): boolean {
    console.log('LogIN', localStorage.getItem('token'));
    return localStorage.getItem('token') !== null;
  }

  async signOut() {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('token');
      window.location.reload();
    } catch (err) {
      this.showToast(err);
    }
  }

  async login(user: User) {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please wait..',
    });
    (await loader).present();

    try {
      await this.afAuth
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
          console.log('serv', data);
          this.setTokentoHeader();
          // redirect to home page
          this.navCtrl.navigateRoot('home');
        });
    } catch (er) {
      this.showToast(er);
    }

    (await loader).dismiss();
  }

  async register(user: User) {
    const loader = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    (await loader).present();
    try {
      await this.afAuth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((data) => {
          console.log('service', data);
          this.setTokentoHeader();
          // --redirect to home page--
          this.navCtrl.navigateRoot('home');
        });
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

  private async setTokentoHeader() {
    try {
      await (await this.afAuth.currentUser)
        .getIdToken(true)
        .then((idToken) => {
          localStorage.setItem('token', idToken);
          console.log('token in storage');
          window.location.reload();
        })
        .catch((er) => {
          this.showToast(er);
        });
    } catch (err) {
      this.showToast(err);
    }
  }
}
