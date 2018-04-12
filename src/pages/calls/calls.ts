import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-calls',
  templateUrl: 'calls.html',
})
export class CallsPage {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CallsPage');
  }
  redirect(){
  	this.viewCtrl.dismiss();
  }

}
