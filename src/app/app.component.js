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
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IndexPage } from '../pages/index/index';
import { Storage } from '@ionic/storage';
import { HeaderColor } from '@ionic-native/header-color';
import { HomePage } from '../pages/home/home';
var MyApp = /** @class */ (function () {
    function MyApp(headerColor, platform, statusBar, storage, splashScreen) {
        var _this = this;
        this.headerColor = headerColor;
        this.storage = storage;
        platform.ready().then(function () {
            statusBar.styleDefault();
            splashScreen.hide();
            _this.headerColor.tint("#D80D88");
            storage.ready().then(function () {
                storage.get('blindyVariables').then(function (val) {
                    if (val) {
                        var info = JSON.parse(val);
                        _this.rootPage = HomePage;
                    }
                    else {
                        _this.rootPage = IndexPage;
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }).catch(function (err) {
                console.log(err);
            });
        });
    }
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [HeaderColor, Platform, StatusBar, Storage, SplashScreen])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map