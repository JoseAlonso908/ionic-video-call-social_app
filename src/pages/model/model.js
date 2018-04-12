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
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
var ModelPage = /** @class */ (function () {
    function ModelPage(navCtrl, socket, viewCtrl, events, navParams) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.socket = socket;
        this.viewCtrl = viewCtrl;
        this.events = events;
        this.navParams = navParams;
        this.module = this.navParams.get('data');
        if (this.module[0] == 'chat') {
            this.menu = [this.module[1].Status, this.module[1].Block, 'Report', 'Delete chat'];
            this.socket.emit('appData', { data: this.module });
            this.socketResponse().subscribe(function (res) {
                var data = res;
                if (data.module == 'friendResponse') {
                    var datam = data.res;
                    _this.menu = [datam.Status, datam.Block, 'Report', 'Delete chat'];
                }
            });
        }
        else if (this.module == 'home') {
            this.menu = ['My account', 'Call logs', 'Log out'];
        }
    }
    ModelPage.prototype.action = function (item) {
        if (item !== 'Blocked') {
            this.events.publish('modelAction', { data: item });
        }
        this.viewCtrl.dismiss();
    };
    ModelPage.prototype.socketResponse = function () {
        var _this = this;
        var observable = new Observable(function (observer) {
            _this.socket.on('serverData', function (data) {
                observer.next(data);
            });
        });
        return observable;
    };
    ModelPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-model',
            templateUrl: 'model.html',
        }),
        __metadata("design:paramtypes", [NavController, Socket, ViewController, Events, NavParams])
    ], ModelPage);
    return ModelPage;
}());
export { ModelPage };
//# sourceMappingURL=model.js.map