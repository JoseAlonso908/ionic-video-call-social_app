import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,ViewController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import {Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-model',
  templateUrl: 'model.html',
})
export class ModelPage {
    module: any;
    menu: any;
  constructor(public navCtrl: NavController,public socket: Socket, public viewCtrl: ViewController, public events: Events, public navParams: NavParams) {
  	this.module =  this.navParams.get('data');
  	 if(this.module[0] == 'chat'){
  	 	this.menu = [this.module[1].Status, this.module[1].Block, 'Report', 'Delete chat'];
  	 	this.socket.emit('appData',{data: this.module});
  	 	this.socketResponse().subscribe(res =>{
  	 		let data:any = res;
  	 		if(data.module == 'friendResponse'){
		  	 		let datam = data.res;
		  	 	    this.menu = [datam.Status, datam.Block, 'Report', 'Delete chat'];
		  	 	}

  	 	})
  	 }else if(this.module == 'home'){
  	 	this.menu = ['My account','Call logs','Log out'];
  	 }
  }
 action(item){
 	if(item !== 'Blocked'){
	 	this.events.publish('modelAction', {data: item});
	 }
	 	this.viewCtrl.dismiss();

 }
 socketResponse(){
		let observable = new Observable( observer =>{
	      this.socket.on('serverData', data=>{
		          observer.next(data);
		      });
		    });
		      return observable;
		}
 

}
