import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import* as Jq from 'jquery';
import { ProviderPage } from '../provider/provider';
import { HomePage } from '../home/home';
import { Storage }from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage {
	errorMessage: string;
  email: string;
  email1: string;
  email2: string;
  emailReal: string;
  constructor(public storage: Storage, public navCtrl: NavController, public events: Events, public navParams: NavParams, public provider: ProviderPage ) {
      this.events.subscribe('successLogin', (data) =>{
         this.storage.set('blindyVariables',JSON.stringify({email: this.emailReal})).catch(function (err) {
                            console.log(err);
          });
        this.navCtrl.setRoot(HomePage);
      });
  }
  ionViewDidLoad(){
  	setTimeout(function(){
  		Jq('#slideImage').toggle(1000,function(){
            Jq('#content').toggle(600);
  		});
  	},2000)
  }
  focus(){
          Jq('.errMessage').hide();
          this.errorMessage = undefined;
  }
  hideShow(hide, show){
    Jq('.errMessage').hide();
  	Jq('#'+hide+'').hide(300,function(){
            Jq('#'+show+'').show(300);
  		});
  }
  onKeyPress(event){
    if(event.keyCode >=48 && event.keyCode <=57) {
      return true;
  }else{
       return false;
    }
  }
  hideShowx(){
    Jq('.hideClass').hide(function(){
      Jq('#login').show();
    });

  }
  indexSubmit(module, data){
      var datam = [];
      if(module == 'signup' || module == 'login' || module == 'fgPass'){
    		if(!ValidateEmail(data[0])){
    			this.errorMessage = 'Enter a valid email.';
            Jq('.errMessage').show();
    		}else if(data[1] && data[1].length < 8){
    			this.errorMessage = 'Password is too short, at least 8 characters.';
              Jq('.errMessage').show();
    		}else if(data[2] && data[1] == data[2]){
    			this.errorMessage = 'Username cannot be the password.';
              Jq('.errMessage').show();
    		}
          this.emailReal = data[0];

      }else{
        if(ValidateEmail(this.email)){
          data.push(this.email);
          datam = data;
          this.emailReal = this.email
        }else if(ValidateEmail(this.email1)){
          data.push(this.email1);
          this.emailReal = this.email1

          datam = data;
        }else if(ValidateEmail(this.email2)){
           data.push(this.email2);
          datam = data;
          this.emailReal = this.email2

        }
      }

  		if(this.errorMessage == undefined){
        this.provider.showLoad();
        data.unshift(module);
  			datam = data;
  			this.provider.socketRequest({data: datam});
  		}
  }
}
function ValidateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
