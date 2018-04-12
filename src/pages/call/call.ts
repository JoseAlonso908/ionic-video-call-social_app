import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ProviderPage } from '../provider/provider';
import * as Peer from 'simple-peer';
import* as Jq from 'jquery';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
@IonicPage()
@Component({
  selector: 'page-call',
  templateUrl: 'call.html',
})
export class CallPage {
      friend: any;
      callType: string;
      callType1: string;
      data:any;
      callStatus: string;
      mic: boolean = false;
      navigator = <any>navigator
      peerId: any;
  constructor(private androidFullScreen: AndroidFullScreen, public screenOrientation: ScreenOrientation, public provider: ProviderPage, public events: Events, public navCtrl: NavController, public navParams: NavParams) {
        
        this.androidFullScreen.isImmersiveModeSupported()
			  .then(() => this.screenOrientation.lock('potrait'))
			  .catch(err => console.log(err));
        var data = this.navParams.get('data');
        this.data = data;
        this.callType1  = data.callType;
       if(data.owner == data.from.email){
       	this.friend = data.to;
        this.callType = 'Outgoing '+data.callType+' call';
         this.callStatus ='calling';
       }else{
       	this.friend = data.from;
        this.callType = 'Incoming '+data.callType+' call';
         this.callStatus ='called';
       }
      
  
      var thisx = this;
       
      this.navigator.getUserMedia({video: true, audio: true}, function(stream){
        var initiator:boolean = false;
        var interval;
        var url = window.URL.createObjectURL(stream);
       if(data.from.email == data.owner){
          initiator = true;
          /*var videox = document.getElementById('video');
          			  videox.setAttribute('src', url);
          alert('okay');*/
       }
       var peer = new Peer({
         initiator: initiator,
         trickle: false,
         stream: stream
       });
       Jq(document).ready(function(){
	       Jq('.btn').click(function(){
	       	var info = data;
	       	  var id = Jq(this).attr('id');
	       	    if(id == 'acceptCall'){
				   thisx.callStatus = 'ongoing';
				   Jq('.callType').text('Connecting...');
                   peer.signal(data.peerid);
				  }else if(id == 'endCall'){
                     peer.destroy();
                     thisx.navCtrl.pop();
                     peer = undefined;
                     data = undefined;
                     clearInterval(interval);
                     let datay = {
					           to: thisx.friend,
					  	  }
                      thisx.provider.socketRequest({data:
				                	['call','callEnded', datay]
				                 })
				  }
	       })
       })
       peer.on('signal', function(data1){
       	if(data.from.email == data.owner){
          	data.peerid = data1;
                provider.socketRequest({data:
                	['call','calling', data]
                 })
       	}else{
       		  let datay = {
					        from: thisx.data.to,
					           to: thisx.data.from,
					           peerid: data1
					  	  }
					  	  thisx.provider.socketRequest({data:
				                	['call','callAccepted', datay]
				                 })
       	}
       })
        peer.on('connect',function(){
        let sec = 0;
          let min = 0;
          let hour = 0;
          let Sec;
          let Min;
          let Hour ;
          interval = setInterval(function(){
              if(sec < 59){
                sec +=1;
              }else if(sec == 59){
                sec = 0;
                if(min < 59){
                      min +=1;
                  }else if(min == 59){
                    hour  +=1;
                    min = 0;
                  }
              }
              if(hour < 10){
                Hour = '0'+hour;
              }else{
                Hour = hour;
              }
              if(min < 10){
                Min = '0'+min;
              }else{
                Min = hour;
              }
              if(sec < 10){
                Sec = '0'+sec;
              }else{
                Sec = sec;
              }
                Jq('.callType').text(Hour+' : '+Min+' : '+Sec);

          },1000);
       })

       thisx.events.subscribe('callAction', (data)=>{
       	if(data.submodule == 'callAccepted'){
                   peer.signal(data.data.peerid);

       	}else if(data.submodule == 'callEnded'){
       		peer.destroy();
            thisx.navCtrl.pop();
            clearInterval(interval);
            peer = undefined;
            data = undefined;


       	}
      })

       peer.on('error', function(err){
       	alert(err);
       })

       peer.on('stream', function(stream){
       	var element
       	if(data.callType == 'audio'){
       		 element = document.getElementById('audio');
       		     element.setAttribute('src', window.URL.createObjectURL(stream));

       	}else if(data.callType == 'video'){
       		alert('video');
       		 element = document.createElement('video');
       		 document.body.appendChild(element);
       		 element.src = window.URL.createObjectURL(stream);
       	}
       	element.play();
       })

      }, function(err){
        alert(JSON.stringify(err));
      })

  }
  onViewDidLeave(){
  	this.screenOrientation.unlock();
  	this.peerId = '';
  }
  callAction(action){
  	
   }

  

}
