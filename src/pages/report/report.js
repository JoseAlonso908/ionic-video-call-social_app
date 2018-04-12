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
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
var ReportPage = /** @class */ (function () {
    function ReportPage(socket, viewCtrl, events, navCtrl, navParams) {
        this.socket = socket;
        this.viewCtrl = viewCtrl;
        this.events = events;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.messageSent = false;
        this.data = this.navParams.get('data');
        this.from = this.data[0].userName;
        this.about = this.data[1].userName;
    }
    ReportPage.prototype.redirect = function () {
        this.end();
    };
    ReportPage.prototype.sendMessage = function (action) {
        if (action === 'done') {
            this.end();
        }
        else if (action === 'sendMessage') {
            this.socket.emit('appData', {
                data: [
                    'reportSent',
                    { from: this.data[0], to: this.data[1], report: this.message },
                ]
            });
            this.messageSent = true;
        }
    };
    ReportPage.prototype.end = function () {
        this.viewCtrl.dismiss();
    };
    ReportPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-report',
            templateUrl: 'report.html',
        }),
        __metadata("design:paramtypes", [Socket, ViewController, Events, NavController, NavParams])
    ], ReportPage);
    return ReportPage;
}());
export { ReportPage };
//# sourceMappingURL=report.js.map