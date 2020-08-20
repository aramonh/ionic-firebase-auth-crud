import { Component, OnInit } from '@angular/core';
import { Post } from '../../interfaces/interfaces';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {
post: Post = {
  title: '',
  details: ''
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

  async createPost(post: Post){
    console.log('post to create', post);
    if (this.formValidation()){
      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Please Wait...'
      });
      (await loader).present();

      try {
        await this.firestore.collection('posts').add(post)
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
    if (!this.post.title ){
      this.showToast('Enter Title');
      return false;
    }
    if (!this.post.details ){
      this.showToast('Enter Details');
      return false;
    }
    return true;
  }

  showToast(message: string){
    console.log(message);
    this.toastCtrl.create({
      message,
      duration: 2000
    }).then(
      toastData => toastData.present()
    );
  }


}
