var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, Events, NavParams, ModalController } from 'ionic-angular';
import * as Jq from 'jquery';
import { ProviderPage } from '../provider/provider';
import * as contry from 'countries-cities';
import { IndexPage } from '../index/index';
import { ImagePage } from '../image/image';
import { Storage } from '@ionic/storage';
import { DatePage } from '../date/date';
import { ChatPage } from '../chat/chat';
import { CallsPage } from '../calls/calls';
var HomePage = /** @class */ (function () {
    function HomePage(storage, modalCtrl, navCtrl, navParams, events, provider) {
        var _this = this;
        this.storage = storage;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.events = events;
        this.provider = provider;
        this.profileComplete = false;
        this.friends = [];
        this.chats = [];
        this.dateCheck = this.provider.functionDate();
        storage.ready().then(function () {
            storage.get('blindyVariables').then(function (val) {
                if (val) {
                    var info = JSON.parse(val);
                    _this.email = info.email;
                    var em = _this.email;
                    setTimeout(function () {
                        provider.socketRequest({ data: ['fetchUserInfo', em] });
                    }, 500);
                }
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
        });
        this.profileinfo = [
            { title: 'What is your age range?', options: ['18 - 29', '30 - 59', '60 - 90'] },
            { title: 'What is your gender?', options: ['Male', 'Female'] },
            { title: 'What is your orientation?', options: ['Straight', 'Gay'] },
            { title: 'What are you interested in?', options: ['Just for fun', 'New friends', 'Dating', 'Long term'] }
        ];
        this.profileinfo2 = [
            { title: 'What should your match age range be?', options: ['18 - 29', '30 - 59', '60 - 90'] },
            { title: 'What should your match be interested in?', options: ['Just for fun', 'New friends', 'Dating', 'Long term'], module: 'intension' }
        ];
        this.countries = contry.getCountries().sort();
        this.countries1 = contry.getCountries().sort();
        this.events.subscribe('modelAction', function (data) {
            var action = data.data;
            var profileModal;
            switch (action) {
                case "Log out":
                    _this.storage.remove('blindyVariables').then(function () {
                        _this.navCtrl.setRoot(IndexPage);
                    }).catch(function (err) {
                        console.log(err);
                    });
                    break;
                case "Call logs":
                    profileModal = _this.modalCtrl.create(CallsPage);
                    profileModal.present();
                    break;
                case "My account":
                    profileModal = _this.modalCtrl.create(ImagePage, { data: [_this.accountInfo, _this.provider.url] });
                    profileModal.present();
                    break;
            }
        });
        this.events.subscribe('HomeEvents', function (datam) {
            switch (datam.info[0]) {
                case "userBasic":
                    _this.accountInfo = datam.info[1];
                    _this.profileComplete = _this.accountInfo.Profile;
                    if (_this.profileComplete == true) {
                        _this.age = _this.accountInfo.age;
                        _this.age1 = _this.accountInfo.age;
                        _this.gender = _this.accountInfo.gender;
                        _this.orientation = _this.accountInfo.orientation;
                        _this.intension = _this.accountInfo.intention;
                        _this.intension1 = _this.accountInfo.intention;
                        _this.country1 = _this.accountInfo.country;
                        _this.country = _this.accountInfo.country;
                        _this.city1 = _this.accountInfo.city;
                        _this.city = _this.accountInfo.city;
                        _this.cities = contry.getCities(_this.country).sort();
                        _this.cities1 = contry.getCities(_this.country1).sort();
                    }
                    break;
                case 'dateFound':
                    var profileModal = _this.modalCtrl.create(DatePage, { data: datam.info[1], myInfo: _this.accountInfo });
                    profileModal.present();
                    break;
                case 'friendChat':
                    _this.chats.push(datam.info[1]);
                    _this.chats = _this.chats.sort(function (a, b) {
                        return b.time - a.time;
                    });
                    if (datam.info[1].more.Status !== 'Add to friends') {
                        _this.friends.push(datam.info[1]);
                        _this.friends = _this.friends.sort(function (a, b) {
                            return b.time - a.time;
                        });
                    }
            }
        });
        this.events.subscribe('MessageReception', function (datam) {
            var data = datam.data;
            switch (data[0]) {
                case "messageSent":
                    var sender = data[2];
                    var receiver = data[3];
                    var newChat;
                    if (sender.id == _this.email) {
                        var index = _this.chats.findIndex(function (m) { return m.id == receiver.id; });
                        if (index > -1) {
                            _this.chats[index].unread = 0;
                            _this.chats[index].message = data[1];
                            newChat = _this.chats[index];
                            _this.chats.splice(index, 1);
                            _this.chats.unshift(newChat);
                        }
                        else {
                            _this.chats.unshift(receiver);
                        }
                    }
                    else if (receiver.id == _this.email) {
                        var index1 = _this.chats.findIndex(function (m) { return m.id == sender.id; });
                        if (index1 > -1) {
                            _this.chats[index1].unread += 1;
                            _this.chats[index1].message = data[1];
                            newChat = _this.chats[index1];
                            _this.chats.splice(index1, 1);
                            _this.chats.unshift(newChat);
                        }
                        else {
                            _this.chats.unshift(sender);
                        }
                    }
                    break;
                case 'updateRead':
                    var index;
                    if (data[1][1] == _this.email) {
                        index = _this.chats.findIndex(function (m) { return m.id == data[1][2]; });
                        if ((index > -1) && (_this.chats[index].message && _this.chats[index].message.from == data[1][2] && _this.chats[index].message.to == _this.email)) {
                            _this.chats[index].unread = 0;
                        }
                    }
                    else if (data[1][2] == _this.email) {
                        index = _this.chats.findIndex(function (m) { return m.id == data[1][1]; });
                        if ((index > -1) && (_this.chats[index].message && _this.chats[index].message.from == _this.email && _this.chats[index].message.to == data[1][2])) {
                            _this.chats[index].message.read = true;
                        }
                    }
                    break;
            }
        });
        this.events.subscribe('FriendResponse', function (data) {
            var datam = data.data;
            var indexFriend;
            var status;
            if (datam) {
                switch (datam[0]) {
                    case "requestAdd":
                        if (datam[3] == _this.email) {
                            indexFriend = _this.chats.findIndex(function (y) { return y.more.Id == datam[4]; });
                            status = 'Remove request';
                        }
                        else if (datam[4] == _this.email) {
                            indexFriend = _this.chats.findIndex(function (y) { return y.more.Id == datam[3]; });
                            status = 'Accept';
                        }
                        if (indexFriend !== undefined) {
                            _this.chats[indexFriend].more.Status = status;
                            _this.friends.push(_this.chats[indexFriend]);
                        }
                        break;
                    case 'requestRemove':
                        if (datam[2] == _this.email) {
                            indexFriend = _this.friends.findIndex(function (y) { return y.more.Id == datam[3]; });
                            _this.friends.splice(indexFriend, 1);
                        }
                        else if (datam[3] == _this.email) {
                            indexFriend = _this.friends.findIndex(function (y) { return y.more.Id == datam[2]; });
                            _this.friends.splice(indexFriend, 1);
                        }
                        break;
                    case 'acceptedRequest':
                        if (datam[2] == _this.email) {
                            indexFriend = _this.friends.findIndex(function (y) { return y.more.Id == datam[3]; });
                        }
                        else if (datam[3] == _this.email) {
                            indexFriend = _this.friends.findIndex(function (y) { return y.more.Id == datam[2]; });
                        }
                        _this.friends[indexFriend].more.Status = datam[1];
                        break;
                }
                ;
            }
        });
    }
    HomePage.prototype.friendClicked = function (info) {
        var friend = info[1];
        var friendInfo = {
            userName: friend.name,
            Profile_pic: friend.image,
            Email: friend.id,
            More: friend.more
        };
        switch (info[0]) {
            case "chat":
                this.navCtrl.push(ChatPage, { friendInfo: friendInfo, myInfo: this.accountInfo });
                break;
            default:
                // code...
                break;
        }
    };
    HomePage.prototype.action = function (action) {
        this.provider.socketRequest({ data: ['friendAction', action[0], this.email, action[1]] });
    };
    HomePage.prototype.submit = function (data) {
        var info = ['updateProfile', this.email];
        info = info.concat(data);
        this.provider.socketRequest({ data: info });
    };
    HomePage.prototype.submit1 = function (data) {
        this.provider.socketRequest({ data: data });
    };
    HomePage.prototype.countryChanged = function (country) {
        this.cities = contry.getCities(country).sort();
        this.city = this.cities[0];
    };
    HomePage.prototype.countryChanged1 = function (country) {
        this.cities1 = contry.getCities(country).sort();
        this.city1 = this.cities1[0];
    };
    HomePage.prototype.search = function (hide, show, actn) {
        Jq('#' + hide + ', .slideDiv').slideUp(300, function () {
            Jq('#' + show + '').toggle();
        });
        var activeSlide = this.slides.getActiveIndex();
        this.slides.lockSwipes(true);
        if (actn == 'srch') {
            switch (activeSlide) {
                case 1:
                    this.holder = this.friends;
                    break;
                case 2:
                    this.holder = this.chats;
                    break;
            }
            ;
        }
        else {
            Jq('.slideDiv').show();
            this.slides.lockSwipes(false);
            this.searchValue = '';
            this.slideData(activeSlide);
            this.holder = [];
            this.matchData = '';
        }
    };
    HomePage.prototype.searchFunction = function (searchValue) {
        var activeSlide = this.slides.getActiveIndex();
        if (searchValue.trim() == '') {
            this.slideData(activeSlide);
        }
        else if (searchValue.trim() !== '' && activeSlide == 2) {
            this.chats = search(this.holder, searchValue);
            if (this.chats.length == 0) {
                this.matchData = 'matching';
            }
        }
        else if (searchValue.trim() !== '' && activeSlide == 1) {
            this.friends = search(this.holder, searchValue);
            if (this.friends.length == 0) {
                this.matchData = 'matching';
            }
        }
    };
    HomePage.prototype.slideData = function (activeSlide) {
        switch (activeSlide) {
            case 1:
                this.friends = this.holder;
                break;
            case 2:
                this.chats = this.holder;
                break;
        }
        ;
    };
    HomePage.prototype.clearSearch = function () {
        this.searchValue = '';
        var activeSlide = this.slides.getActiveIndex();
        switch (activeSlide) {
            case 1:
                this.friends = this.holder;
                break;
            case 2:
                this.chats = this.holder;
                break;
        }
        ;
    };
    HomePage.prototype.slideChanged = function () {
        Jq('#Header').slideDown(600);
        Jq('#Header2').slideUp(600);
        var pos = this.slides.getActiveIndex();
        if (pos < 4) {
            Jq('.active').removeClass('active');
            Jq('.cls' + pos + '').addClass('active');
        }
        if ((pos == 1 && this.friends.length > 1) || pos == 2) {
            Jq('.search1').show();
            Jq('#blindy').show(200);
        }
        else {
            Jq('.search1').hide();
        }
    };
    HomePage.prototype.switchSlide = function (pos) {
        this.slides.slideTo(pos, 600);
    };
    HomePage.prototype.gotScrolled = function (event, div) {
        var pos = 0;
        var scroll = Jq("#" + div + "").scrollTop();
        if ((pos - scroll) < pos) {
            Jq('#blindy').slideUp(100);
        }
        else {
            Jq('#blindy').slideDown(100);
        }
        pos = scroll;
    };
    HomePage.prototype.presentPopover = function (myEvent, data) {
        this.provider.presentPopover(myEvent, data);
    };
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], HomePage.prototype, "slides", void 0);
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [Storage, ModalController, NavController, NavParams, Events, ProviderPage])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
function search(array, value) {
    var returnValue = [];
    var arry = array;
    arry.map(function (y) {
        var index = y.name.toLowerCase().indexOf(value.toLowerCase());
        if (index !== -1) {
            returnValue.push(y);
        }
    });
    return returnValue;
}
//# sourceMappingURL=home.js.map