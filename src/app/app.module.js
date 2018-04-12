var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HeaderColor } from '@ionic-native/header-color';
import { MyApp } from './app.component';
import { CallPage } from '../pages/call/call';
import { ChatPage } from '../pages/chat/chat';
import { ImagePage } from '../pages/image/image';
import { IndexPage } from '../pages/index/index';
import { ReportPage } from '../pages/report/report';
import { ProviderPage } from '../pages/provider/provider';
import { HomePage } from '../pages/home/home';
import { SendPicPage } from '../pages/send-pic/send-pic';
import { ModelPage } from '../pages/model/model';
import { CallsPage } from '../pages/calls/calls';
import { DatePage } from '../pages/date/date';
import { SocketIoModule } from 'ng-socket-io';
import { IonicStorageModule } from '@ionic/storage';
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
var config = { url: 'http://192.168.43.41:9000', options: {} };
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                HomePage,
                CallPage,
                ChatPage,
                ImagePage,
                IndexPage,
                DatePage,
                SendPicPage,
                CallsPage,
                ReportPage,
                ModelPage
            ],
            imports: [
                BrowserModule,
                SocketIoModule.forRoot(config),
                EmojiPickerModule.forRoot(),
                IonicModule.forRoot(MyApp),
                IonicStorageModule.forRoot({
                    name: '__mydb',
                    driverOrder: ['indexeddb', 'sqlite', 'websql']
                })
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
                HomePage,
                CallPage,
                ChatPage,
                ImagePage,
                ModelPage,
                DatePage,
                SendPicPage,
                CallsPage,
                ReportPage,
                IndexPage
            ],
            providers: [
                StatusBar,
                ProviderPage,
                HeaderColor,
                SplashScreen,
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                Camera,
                File,
                FileTransfer,
                FileTransferObject
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map