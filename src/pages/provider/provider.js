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
import { IonicPage, ToastController, LoadingController, Events, PopoverController, AlertController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import * as Jq from 'jquery';
import { ModelPage } from '../model/model';
import { Storage } from '@ionic/storage';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
var ProviderPage = /** @class */ (function () {
    function ProviderPage(storage, socket, transfer, camera, events, alertCtrl, loadCtrl, popoverCtrl, toastCtrl) {
        var _this = this;
        this.storage = storage;
        this.socket = socket;
        this.transfer = transfer;
        this.camera = camera;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.loadCtrl = loadCtrl;
        this.popoverCtrl = popoverCtrl;
        this.toastCtrl = toastCtrl;
        this.url1 = 'http://192.168.43.41:3000/';
        this.url = 'http://192.168.43.41:3000//';
        storage.ready().then(function () {
            storage.get('blindyVariables').then(function (val) {
                if (val) {
                    var info = JSON.parse(val);
                    _this.email = info.email;
                }
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
        });
        this.socketResponse().subscribe(function (res) {
            var data = res;
            if (_this.LoadController) {
                _this.LoadController.dismiss();
            }
            switch (data.module) {
                case : 'imageUpdated';
                case 'signupResponse':
                    switch (data.res) {
                        case "failed":
                            Jq('.errMessage').text('The email you entered is already registered.').show();
                            break;
                        case "success":
                            Jq('#Signup').hide(300, function () {
                                Jq('#verification').toggle(300);
                            });
                            break;
                    }
                    break;
                case 'loginResponse':
                    switch (data.res) {
                        case "inactive":
                            Jq('#login').hide(300, function () {
                                Jq('#verification').toggle(300);
                            });
                            break;
                        case "success":
                            _this.events.publish('successLogin');
                            break;
                        case "success2":
                            Jq('#verification2').hide(function () {
                                Jq('#fgPass').show(300, function () {
                                    Jq('#fgPass3').hide();
                                    Jq('#fgPass2').show();
                                });
                            });
                            break;
                        case 'codeSent':
                            var count_1 = 30;
                            var interval = setInterval(function () {
                                if (count_1 == 0) {
                                    Jq('.resendBtn').attr('disabled', false).text('Resend code');
                                    clearInterval(interval);
                                }
                                else {
                                    Jq('.resendBtn').attr('disabled', true).text('Code sent ' + count_1);
                                }
                                count_1--;
                            }, 1000);
                            break;
                        case 'codeSent2':
                            var count2_1 = 30;
                            var interval2 = setInterval(function () {
                                if (count2_1 == 0) {
                                    Jq('.resendBtn2').attr('disabled', false).text('Resend code');
                                    clearInterval(interval2);
                                }
                                else {
                                    Jq('.resendBtn2').attr('disabled', true).text('Code sent ' + count2_1);
                                }
                                count2_1--;
                            }, 1000);
                            break;
                        case 'emailFound':
                            Jq('#fgPass').hide();
                            Jq('#verification2').show();
                            break;
                        default:
                            Jq('.errMessage').text(data.res).show();
                            break;
                    }
                    break;
                case 'HomeResponse':
                    switch (data.submodule) {
                        case "search":
                            switch (data.res[0]) {
                                case "No match found":
                                    var alert_1 = _this.alertCtrl.create({
                                        title: data.res[0] + '!',
                                        subTitle: 'You can try a random search.',
                                        buttons: ['Ok']
                                    });
                                    alert_1.present();
                                    break;
                                default:
                                    _this.events.publish('HomeEvents', { info: ['dateFound', data.res] });
                                    break;
                            }
                            break;
                        default:
                            _this.events.publish('HomeEvents', { info: [data.submodule, data.res] });
                            break;
                    }
                    break;
                case 'ChatResponse':
                    _this.events.publish('MessageReception', { data: data.res, myId: _this.email });
                    break;
                case 'FriendResponse':
                    _this.events.publish('FriendResponse', { data: data.res });
                    break;
                case 'friendResponse':
                    _this.events.publish('friendResponse', data.res);
                    break;
            }
        });
        this.events.subscribe('uploadingImage', function (info) {
            var data = info.data;
            var options;
            var params;
            if (data[1] == 'takeImage') {
                options = {
                    quality: 60,
                    destinationType: _this.camera.DestinationType.DATA_URL,
                    encodingType: _this.camera.EncodingType.JPEG,
                    mediaType: _this.camera.MediaType.PICTURE,
                    targetWidth: 250,
                    targetHeight: 250,
                    allowEdit: true,
                    correctOrientation: true,
                };
            }
            else if (data[1] == 'chooseImage') {
                options = {
                    quality: 60,
                    destinationType: _this.camera.DestinationType.DATA_URL,
                    encodingType: _this.camera.EncodingType.JPEG,
                    sourceType: _this.camera.PictureSourceType.PHOTOLIBRARY,
                    targetWidth: 250,
                    targetHeight: 250,
                    allowEdit: true,
                    correctOrientation: true,
                };
            }
            _this.camera.getPicture(options).then(function (imageData) {
                _this.imageUpload = 'data:image/jpeg;base64,' + imageData;
                _this.events.publish(data[0], { data: _this.imageUpload });
                _this.email = data[2];
                _this.action = data[0];
                if (data[0] == 'profile') {
                    params = [data[2]];
                    _this.imageUploadFunction(data, params);
                }
            }, function (err) {
                console.log(JSON.stringify(err));
            });
        });
    }
    ProviderPage.prototype.imageUploadFunction = function (data, params) {
        var _this = this;
        var fileTransfer = this.transfer.create();
        var options = {
            fileKey: 'ionicfile',
            fileName: 'ionicfile',
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {},
            params: { data: data[0], owner: params[0], receiver: params[1] }
        };
        this.showLoad();
        fileTransfer.upload(this.imageUpload, this.url1 + 'imageUpload', options)
            .then(function (datam) {
            if (_this.LoadController) {
                _this.LoadController.dismiss();
            }
            /* let datx:any = JSON.stringify(datam);
             let string = datx.split('\\"');
              this.showToast('Profile has been updated.');
              this.events.publish('imageChaned', {image: string[]});
           */
        }, function (err) {
            if (_this.LoadController) {
                _this.LoadController.dismiss();
            }
            console.log(JSON.stringify(err));
            _this.showToast('Photo could not be uploaded');
        });
    };
    ProviderPage.prototype.presentPopover = function (myEvent, data) {
        var popover = this.popoverCtrl.create(ModelPage, { data: data });
        popover.present({
            ev: myEvent
        });
    };
    ProviderPage.prototype.socketRequest = function (data) {
        if (data.data[0] == 'updateProfile' || data.data[0] == 'randomMatch' || data.data[0] == 'findMatch') {
            this.showLoad();
        }
        this.socket.emit('appData', data);
    };
    ProviderPage.prototype.showToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'middle'
        });
        toast.present();
    };
    ProviderPage.prototype.showLoad = function () {
        this.LoadController = this.loadCtrl.create({
            content: 'just a moment...'
        });
        this.LoadController.present();
    };
    ProviderPage.prototype.socketResponse = function () {
        var _this = this;
        var observable = new Observable(function (observer) {
            _this.socket.on('serverData', function (data) {
                observer.next(data);
            });
        });
        return observable;
    };
    ProviderPage.prototype.functionDate = function () {
        var day = new Date();
        var Todaydate = day.getDate() + '/' + Math.floor(day.getMonth() + 1) + '/' + day.getFullYear();
        var PreviousDate = Math.floor(day.getDate() - 1) + '/' + Math.floor(day.getMonth() + 1) + '/' + day.getFullYear();
        return [Todaydate, PreviousDate];
    };
    ProviderPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-provider'
        }),
        __metadata("design:paramtypes", [Storage, Socket, FileTransfer, Camera, Events, AlertController, LoadingController, PopoverController, ToastController])
    ], ProviderPage);
    return ProviderPage;
}());
export { ProviderPage };
//# sourceMappingURL=provider.js.map