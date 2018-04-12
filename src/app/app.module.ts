import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HeaderColor } from '@ionic-native/header-color';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
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
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { IonicStorageModule } from '@ionic/storage';
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { Camera } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';
const config: SocketIoConfig = {url: 'http://192.168.43.41:9000',options: {}};
@NgModule({
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    AndroidFullScreen,
    ScreenOrientation,
    PhotoViewer,
    File,
    FileTransfer,
    FileTransferObject
  ]
})
export class AppModule {}
