import { Component, OnInit } from '@angular/core';
import { Post } from '../../interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {
  post: Post = {
    title: '',
    details: ''
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
      this.getPostById(this.id);
    }
  }

  async getPostById(id: string){
      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Please Wait...'
      });
      (await loader).present();

      try {
        this.firestore.doc('posts/' + id )
        .valueChanges()
        .subscribe( data => {
          // tslint:disable-next-line: no-string-literal
          this.post.title = data['title'];
          // tslint:disable-next-line: no-string-literal
          this.post.details = data['details'];
        });

    } catch (er) {
      this.showToast(er);

    }
      // dismiss loader
      (await loader).dismiss();
  }

  async updatePost(post: Post){
    if (this.formValidation()){
      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Please Wait...'
      });
      (await loader).present();

      try {
        await this.firestore.collection('posts').doc(this.id).update(post).then( data => {
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
