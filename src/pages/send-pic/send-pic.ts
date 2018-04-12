import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
//import* as Jq from 'jquery';
import { ProviderPage } from '../provider/provider';


@IonicPage()
@Component({
  selector: 'page-send-pic',
  templateUrl: 'send-pic.html',
})
export class SendPicPage {
  message: string;
  friendInfo: any;
  myInfo: any;
  image: any;
  constructor(public navCtrl: NavController, public provider: ProviderPage, public viewCtrl:ViewController, public navParams: NavParams, public events: Events) {
  	this.friendInfo = this.navParams.get('friendInfo');
  	this.myInfo = this.navParams.get('myInfo');
    this.image = this.navParams.get('image');
     this.events.subscribe('sendImage', (info)=>{
       if(info){
           this.image = info.data;
         }else if(info == undefined){
           this.viewCtrl.dismiss();
         }
           
      })
         
  }

  sendMessage(message){
	 	this.provider.socketRequest1({data: ['messageSent',message, this.friendInfo, this.myInfo, 'image']});
  		this.viewCtrl.dismiss();

	 }
  
 redirect(){
  	this.viewCtrl.dismiss();
  }
  handleSelection(event) {
  if(this.message == undefined ){
      this.message = '';
    }
    this.message = this.message + " " + event.char;
  }

}
