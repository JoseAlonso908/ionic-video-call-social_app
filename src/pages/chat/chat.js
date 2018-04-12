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
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import * as Jq from 'jquery';
import { ProviderPage } from '../provider/provider';
import { SendPicPage } from '../send-pic/send-pic';
import { ReportPage } from '../report/report';
var ChatPage = /** @class */ (function () {
    function ChatPage(navCtrl, modalCtrl, events, navParams, provider) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.events = events;
        this.navParams = navParams;
        this.provider = provider;
        this.messages = [];
        this.block = false;
        this.dateCheck = this.provider.functionDate();
        this.friendInfo = this.navParams.get('friendInfo');
        this.myInfo = this.navParams.get('myInfo');
        this.myId = this.myInfo.Email;
        this.provider.socketRequest({ data: ['fetchFirstmess', this.myId, this.friendInfo.Email] });
        this.modalx = this.modalCtrl.create(ReportPage, { data: [this.myInfo, this.friendInfo] });
        this.events.subscribe('MessageReception', function (info) {
            var data = info.data;
            switch (data[0]) {
                case "messageSent":
                    var friendx = _this.friendInfo;
                    if ((data[1].from == _this.myId && data[1].to == friendx.Email) || (data[1].to == _this.myId && data[1].from == friendx.Email)) {
                        _this.messages.push(data[1]);
                        Jq(".textDivision").scrollTop(1E10);
                        if (data[1].from == _this.myId) {
                            _this.message = '';
                        }
                        _this.provider.socketRequest({ data: ['updateRead', _this.myId, friendx.Email] });
                    }
                    break;
                case 'updateRead':
                    var friend = _this.friendInfo;
                    if (data[1][2] == _this.myId && data[1][1] == friend.Email) {
                        _this.messages.forEach(function (mess) {
                            mess.read = true;
                        });
                    }
                    break;
                case 'fetchFirstmess':
                    _this.messages = data[1];
                    if (data[2]) {
                        _this.firstMess = data[2].id;
                    }
                case 'fetchSubsequent':
                    var messages_1 = _this.messages;
                    data[1].forEach(function (dax) {
                        if (messages_1.findIndex(function (m) { return m.id == dax.id; }) == -1) {
                            messages_1.unshift(dax);
                        }
                    });
                    Jq('.floatingMenu').slideUp(600);
                    break;
            }
        });
        this.events.subscribe('modelAction', function (data) {
            var action = data.data;
            if (action == 'Report') {
                if (_this.modalx) {
                    _this.modalx.present();
                    _this.modalx = undefined;
                }
            }
            else {
                _this.provider.socketRequest({ data: ['friendAction', action, _this.myId, _this.friendInfo.Email] });
            }
        });
        this.events.subscribe('FriendResponse', function (data) {
            var datam = data.data;
            if (datam) {
                switch (datam[0]) {
                    case "Block":
                        if ((datam[3] == _this.myId && datam[4] == _this.friendInfo.Email) || (datam[4] == _this.myId && datam[3] == _this.friendInfo.Email)) {
                            _this.block = true;
                        }
                        break;
                    case "Unblock":
                        if ((datam[2] == _this.myId && datam[3] == _this.friendInfo.Email) || (datam[3] == _this.myId && datam[2] == _this.friendInfo.Email)) {
                            _this.block = false;
                        }
                        break;
                    case 'Deletechat':
                        if (datam[1] == _this.myId && datam[2] == _this.friendInfo.Email) {
                            _this.messages = '';
                        }
                        break;
                }
                ;
            }
        });
        this.events.subscribe('friendResponse', function (data) {
            if (data && (data.Block == 'Unblock' || data.Block == 'Blocked')) {
                _this.block = true;
            }
            else {
                _this.block = false;
            }
        });
    }
    ChatPage.prototype.ionViewDidLeave = function () {
        this.friendInfo = '';
        this.myId = '';
    };
    ChatPage.prototype.ionViewDidLoad = function () {
        if (this.myId && this.messages.length > 0) {
            this.provider.socketRequest({ data: ['updateRead', this.myId, this.friendInfo.Email] });
            this.provider.socketRequest({ data: ['chat', this.myId, this.friendInfo.Email] });
        }
    };
    ChatPage.prototype.gotScrolled = function (event) {
        this.lastMess = this.messages[0].id;
        if (Jq('#content').scrollTop() == 0 && this.lastMess !== this.firstMess) {
            Jq('.floatingMenu').slideDown(600);
            this.provider.socketRequest({ data: ['fetchSubsequent', this.myId, this.friendInfo.Email, this.lastMess] });
        }
    };
    ChatPage.prototype.readAll = function () {
        this.provider.socketRequest({ data: ['updateRead', this.myId, this.friendInfo.Email] });
    };
    ChatPage.prototype.sendMessage = function (message) {
        var info = this.friendInfo;
        this.provider.socketRequest({ data: ['messageSent', message, this.friendInfo, this.myInfo] });
    };
    ChatPage.prototype.textAreaAction = function (action) {
        switch (action) {
            case "focused":
                Jq('.chatIcon2').hide(200, function () {
                    Jq('.chatIcon1').show(300, function () {
                        Jq('.textArea').animate({ width: "70%" });
                    });
                });
                break;
            default:
                Jq('.chatIcon1').hide(200, function () {
                    Jq('.chatIcon2').show(300, function () {
                        Jq('.textArea').animate({ width: "60%" });
                    });
                }).
                    break;
        }
    };
    ChatPage.prototype.presentPopover = function (myEvent, data) {
        this.provider.presentPopover(myEvent, data);
    };
    ChatPage.prototype.modal = function () {
        var profileModal = this.modalCtrl.create(SendPicPage, { friendInfo: this.friendInfo, myInfo: this.myInfo });
        profileModal.present();
    };
    ChatPage.prototype.handleSelection = function (event) {
        if (this.message == undefined) {
            this.message = '';
        }
        this.message = this.message + " " + event.char;
    };
    ChatPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-chat',
            templateUrl: 'chat.html',
        }),
        __metadata("design:paramtypes", [NavController, ModalController, Events, NavParams, ProviderPage])
    ], ChatPage);
    return ChatPage;
}());
export { ChatPage };
//# sourceMappingURL=chat.js.map