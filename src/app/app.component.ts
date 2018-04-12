import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IndexPage } from '../pages/index/index';
import { Storage }from '@ionic/storage';
import { HeaderColor } from '@ionic-native/header-color';
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  email: string;
  constructor(private headerColor: HeaderColor, platform: Platform, statusBar: StatusBar, public storage: Storage, splashScreen: SplashScreen) {
    platform.ready().then(() => {
       //statusBar.styleDefault();
        splashScreen.hide();
        this.headerColor.tint("#b70360");
         storage.ready().then(() => {
             storage.get('blindyVariables').then((val) => {
               if(val){
                 this.rootPage = HomePage;
               }else{
                 this.rootPage = IndexPage;
               }
             }).catch(function (err) {
                console.log(err);
            })
          }).catch(function (err) {
                console.log(err);
            });
    });
  }
}

