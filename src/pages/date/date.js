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
import { ChatPage } from '../chat/chat';
import { ProviderPage } from '../provider/provider';
var DatePage = /** @class */ (function () {
    function DatePage(navCtrl, provider, viewCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.friendInfo = this.navParams.get('data')[0];
        this.myInfo = this.navParams.get('myInfo');
    }
    DatePage.prototype.redirect = function () {
        this.viewCtrl.dismiss();
    };
    DatePage.prototype.sendMessage = function () {
        this.navCtrl.push(ChatPage, { friendInfo: this.friendInfo, myInfo: this.myInfo });
    };
    DatePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-date',
            templateUrl: 'date.html',
        }),
        __metadata("design:paramtypes", [NavController, ProviderPage, ViewController, NavParams])
    ], DatePage);
    return DatePage;
}());
export { DatePage };
//# sourceMappingURL=date.js.map