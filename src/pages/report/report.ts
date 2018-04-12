import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,Events } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
    message: string;
    from: string;
    about: string;
    messageSent: boolean = false;
    data: any;
  constructor(public socket: Socket, public viewCtrl: ViewController,public events:Events, public navCtrl: NavController, public navParams: NavParams) {
     this.data = this.navParams.get('data');
     this.from = this.data[0].userName
     this.about = this.data[1].userName

  }
  redirect(){
   this.end();
  }
  sendMessage(action){
      if(action ==='done'){
           this.end();
      }else if(action === 'sendMessage'){
        this.socket.emit('appData',{
          data: [
           'reportSent',
           {from: this.data[0], to: this.data[1], report: this.message},
          ]
        }
          );
        this.messageSent = true;
      }
  }
  end(){
    this.viewCtrl.dismiss();
  }

}
