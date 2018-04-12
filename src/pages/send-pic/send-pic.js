var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
//import* as Jq from 'jquery';
import { ProviderPage } from '../provider/provider';
var SendPicPage = /** @class */ (function () {
    function SendPicPage(navCtrl, provider, viewCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.friendInfo = this.navParams.get('friendInfo');
        this.myInfo = this.navParams.get('myInfo');
    }
    SendPicPage.prototype.sendMessage = function (message) {
        this.provider.socketRequest({ data: ['messageSent', message, this.friendInfo, this.myInfo, 'images/slide.jpeg'] });
        this.viewCtrl.dismiss();
    };
    SendPicPage.prototype.redirect = function () {
        this.viewCtrl.dismiss();
    };
    SendPicPage.prototype.handleSelection = function (event) {
        if (this.message == undefined) {
            this.message = '';
        }
        this.message = this.message + " " + event.char;
    };
    SendPicPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-send-pic',
            templateUrl: 'send-pic.html',
        }),
        __metadata("design:paramtypes", [NavController, ProviderPage, ViewController, NavParams])
    ], SendPicPage);
    return SendPicPage;
}());
export { SendPicPage };
//# sourceMappingURL=send-pic.js.map