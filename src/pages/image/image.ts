import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, Events } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-image',
  templateUrl: 'image.html',
})
export class ImagePage {
   acountInfo: any;
   url: string;
   name: string;
   profileImage: string;
  constructor(public navCtrl: NavController, public actionCtrl: ActionSheetController, public events: Events, public viewCtrl: ViewController, public navParams: NavParams) {
  	   var data = this.navParams.get('data');
  	 this.acountInfo = data[0];
     this.url = data[1];
  	  this.profileImage = this.url+''+this.acountInfo.Profile_pic;
  	 this.name = this.acountInfo.userName;
  	  this.events.subscribe('profile', (data) =>{
  	  	   this.profileImage = data.data;
  	  })
  }

 redirect(action){
 	switch (action) {
 		case "close":
	 	this.viewCtrl.dismiss();
 			break;
 		case 'camera':
 		      var actions:any = this.actionCtrl.create({
 		      	buttons: [
	 		      	{text: 'Take a new picture', icon: 'camera', role: 'destructive', handler: ()=>{ this.takePicture(['profile','takeImage',this.acountInfo.Email])}},
	 		      	{text: 'Choose from photos', icon: 'image', role: 'destructive', handler: ()=>{ this.takePicture(['profile', 'chooseImage',this.acountInfo.Email])}},
	 		      	{text: 'Cancel', icon: 'close', role: 'cancel'}
 		      	]
 		      })
 		      actions.present();
 		default:
 			// code...
 			break;
 	}

 }
	 takePicture(data){
	 	this.events.publish('uploadingImage', {data: data})
	 }

}
