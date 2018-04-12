import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { ProviderPage } from '../provider/provider';


@IonicPage()
@Component({
  selector: 'page-date',
  templateUrl: 'date.html',
})
export class DatePage {
   friendInfo: any;
   myInfo: any;
  constructor(public navCtrl: NavController, public provider: ProviderPage, public viewCtrl: ViewController, public navParams: NavParams) {
  		this.friendInfo = this.navParams.get('data')[0];
  		this.myInfo = this.navParams.get('myInfo');

  }
  redirect(){
  	this.viewCtrl.dismiss();
  }
   sendMessage(){
   	this.navCtrl.push(ChatPage,{friendInfo: this.friendInfo, myInfo: this.myInfo});
   }
}
