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
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, Events } from 'ionic-angular';
var ImagePage = /** @class */ (function () {
    function ImagePage(navCtrl, actionCtrl, events, viewCtrl, navParams) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.actionCtrl = actionCtrl;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        var data = this.navParams.get('data');
        this.acountInfo = data[0];
        this.url = data[1];
        this.profileImage = this.url + '' + this.acountInfo.Profile_pic;
        this.name = this.acountInfo.userName;
        this.events.subscribe('profile', function (data) {
            _this.profileImage = data.data;
        });
    }
    ImagePage.prototype.redirect = function (action) {
        var _this = this;
        switch (action) {
            case "close":
                this.viewCtrl.dismiss();
                break;
            case 'camera':
                var actions = this.actionCtrl.create({
                    buttons: [
                        { text: 'Take a new picture', icon: 'camera', role: 'destructive', handler: function () { _this.takePicture(['profile', 'takeImage', _this.acountInfo.Email]); } },
                        { text: 'Choose from photos', icon: 'image', role: 'destructive', handler: function () { _this.takePicture(['profile', 'chooseImage', _this.acountInfo.Email]); } },
                        { text: 'Cancel', icon: 'close', role: 'cancel' }
                    ]
                });
                actions.present();
            default:
                // code...
                break;
        }
    };
    ImagePage.prototype.takePicture = function (data) {
        this.events.publish('uploadingImage', { data: data });
    };
    ImagePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-image',
            templateUrl: 'image.html',
        }),
        __metadata("design:paramtypes", [NavController, ActionSheetController, Events, ViewController, NavParams])
    ], ImagePage);
    return ImagePage;
}());
export { ImagePage };
//# sourceMappingURL=image.js.map