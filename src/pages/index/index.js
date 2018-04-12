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
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as Jq from 'jquery';
import { ProviderPage } from '../provider/provider';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
var IndexPage = /** @class */ (function () {
    function IndexPage(storage, navCtrl, events, navParams, provider) {
        var _this = this;
        this.storage = storage;
        this.navCtrl = navCtrl;
        this.events = events;
        this.navParams = navParams;
        this.provider = provider;
        this.events.subscribe('successLogin', function (data) {
            _this.storage.set('blindyVariables', JSON.stringify({ email: _this.emailReal })).catch(function (err) {
                console.log(err);
            });
            _this.navCtrl.setRoot(HomePage);
        });
    }
    IndexPage.prototype.ionViewDidLoad = function () {
        setTimeout(function () {
            Jq('#slideImage').toggle(1000, function () {
                Jq('#content').toggle(600);
            });
        }, 2000);
    };
    IndexPage.prototype.focus = function () {
        Jq('.errMessage').hide();
        this.errorMessage = undefined;
    };
    IndexPage.prototype.hideShow = function (hide, show) {
        Jq('.errMessage').hide();
        Jq('#' + hide + '').hide(300, function () {
            Jq('#' + show + '').show(300);
        });
    };
    IndexPage.prototype.onKeyPress = function (event) {
        if (event.keyCode >= 48 && event.keyCode <= 57) {
            return true;
        }
        else {
            return false;
        }
    };
    IndexPage.prototype.hideShowx = function () {
        Jq('.hideClass').hide(function () {
            Jq('#login').show();
        });
    };
    IndexPage.prototype.indexSubmit = function (module, data) {
        var datam = [];
        if (module == 'signup' || module == 'login' || module == 'fgPass') {
            if (!ValidateEmail(data[0])) {
                this.errorMessage = 'Enter a valid email.';
                Jq('.errMessage').show();
            }
            else if (data[1] && data[1].length < 8) {
                this.errorMessage = 'Password is too short, at least 8 characters.';
                Jq('.errMessage').show();
            }
            else if (data[2] && data[1] == data[2]) {
                this.errorMessage = 'Username cannot be the password.';
                Jq('.errMessage').show();
            }
            this.emailReal = data[0];
        }
        else {
            if (ValidateEmail(this.email)) {
                data.push(this.email);
                datam = data;
                this.emailReal = this.email;
            }
            else if (ValidateEmail(this.email1)) {
                data.push(this.email1);
                this.emailReal = this.email1;
                datam = data;
            }
            else if (ValidateEmail(this.email2)) {
                data.push(this.email2);
                datam = data;
                this.emailReal = this.email2;
            }
        }
        if (this.errorMessage == undefined) {
            this.provider.showLoad();
            data.unshift(module);
            datam = data;
            this.provider.socketRequest({ data: datam });
        }
    };
    IndexPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-index',
            templateUrl: 'index.html',
        }),
        __metadata("design:paramtypes", [Storage, NavController, Events, NavParams, ProviderPage])
    ], IndexPage);
    return IndexPage;
}());
export { IndexPage };
function ValidateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
//# sourceMappingURL=index.js.map