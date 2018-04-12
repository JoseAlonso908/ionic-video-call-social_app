import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPicPage } from './send-pic';

@NgModule({
  declarations: [
    SendPicPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPicPage),
  ],
})
export class SendPicPageModule {}
