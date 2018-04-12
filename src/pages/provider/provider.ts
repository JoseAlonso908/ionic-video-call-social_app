import { Component } from '@angular/core';
import { IonicPage, ToastController, LoadingController, Events, PopoverController, AlertController} from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import {Observable } from 'rxjs/Observable';
import* as Jq from 'jquery';
import { ModelPage } from '../model/model';
import { Storage }from '@ionic/storage';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';


@IonicPage()
@Component({
  selector: 'page-provider'
})
export class ProviderPage {
   LoadController: any;
    url1: string = 'http://192.168.43.41:3000/';
    url: string = 'http://192.168.43.41:3000//';
    email: string;
    imageUpload;
    action: string;
    drafts: any = [];
  constructor(public photoViewer: PhotoViewer, public storage: Storage, public socket: Socket, public transfer: FileTransfer, public camera: Camera, public events: Events, public alertCtrl: AlertController, public loadCtrl: LoadingController,  public popoverCtrl: PopoverController,  public toastCtrl: ToastController) {
  	 storage.ready().then(() => {
             storage.get('blindyVariables').then((val) => {
               if(val){
                 let info = JSON.parse(val);
                 this.email = info.email
             }
             }, err => {
             	console.log(err);
             });
	         },err=>{
	         	console.log(err);
	         });
  	this.socketResponse().subscribe(res=>{
  		let data: any = res;
  		if(this.LoadController){
  			this.LoadController.dismiss();
  		}
  		switch(data.module){
        case 'callResponse':
           if(data.data.to.email == this.email){
             if(data.submodule == 'calling'){
                this.callActon(data.data);
              }else{
                this.events.publish('callAction', data);
              }
            }
              break;

        case 'updateMessageImage':
              this.events.publish('updateMessageImage', {data: data.data});
              break;
        case 'imageUpdated':
             this.events.publish('profileImageUpdated', {owner: data.ownerImage, image: data.image});
        break;
  			case 'signupResponse':
  				 switch (data.res) {
  				 	case "failed":
  				 			Jq('.errMessage').text('The email you entered is already registered.').show();
  				 		break;
  				 	case "success":
			  				 	Jq('#Signup').hide(300,function(){
	  				 				Jq('#verification').toggle(300);
  				 			})
  				 			break;
  				 }
  			break;
  			case 'loginResponse':
  				switch (data.res) {
  					case "inactive":
							Jq('#login').hide(300,function(){
  				 				Jq('#verification').toggle(300);
  				 			})
  						  break;
					case "success":
							this.events.publish('successLogin');
  						 break;
					case "success2":
					 		Jq('#verification2').hide(function(){
					 		   Jq('#fgPass').show(300,function(){
					 		  		 Jq('#fgPass3').hide();
					 		  		 Jq('#fgPass2').show()

					 		   });
					 		});
					 		break
					case 'codeSent':
							let count = 30;
							var interval = setInterval(function(){
	    						if(count == 0){
	    							Jq('.resendBtn').attr('disabled',false).text('Resend code');
	    							clearInterval(interval);
	    						}else{
	    							Jq('.resendBtn').attr('disabled',true).text('Code sent '+ count);
	    						}
								count--;

							},1000);
							break;
					case 'codeSent2':
							let count2 = 30;
							var interval2 = setInterval(function(){
								if(count2 == 0){
									Jq('.resendBtn2').attr('disabled',false).text('Resend code');
									clearInterval(interval2);
								}else{
									Jq('.resendBtn2').attr('disabled',true).text('Code sent '+ count2);
								}
								count2--;

							},1000);
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
										 let alert = this.alertCtrl.create({
												    title: data.res[0]+'!',
												    subTitle: 'You can try a random search.',
												    buttons: ['Ok']
												  });
											  alert.present();
										break;
									
									default:
							             this.events.publish('HomeEvents',{info: ['dateFound', data.res]})
										break;
								}
						  break;
					default:
						     this.events.publish('HomeEvents',{info: [data.submodule, data.res]})
						break;
				}
			  break;
			case 'ChatResponse':
				 this.events.publish('MessageReception', {data: data.res, myId: this.email})
		    	break;
		    case 'FriendResponse':
				 this.events.publish('FriendResponse', {data: data.res});
		   		 break;
   		    case 'friendResponse':
   		    this.events.publish('friendResponse', data.res);
   		    		break;

  		}
  	})

  	this.events.subscribe('uploadingImage', (info)=>{
  
   		var data =  info.data;
  		var options: CameraOptions;
         var params; 
       
         


  		if(data[1] == 'takeImage'){
                   options = {
               				quality: 60,
               				destinationType: this.camera.DestinationType.DATA_URL,
               				encodingType: this.camera.EncodingType.JPEG,
               				mediaType: this.camera.MediaType.PICTURE,
							        correctOrientation: true,
               			  }

  		}else if(data[1] == 'chooseImage'){
   				   options = {
               				quality: 60,
               				destinationType: this.camera.DestinationType.DATA_URL,
               				encodingType: this.camera.EncodingType.JPEG,
                 		  sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
						         correctOrientation: true,
               			  }
  		}
       if(data[0] == 'profile'){
                      options.allowEdit = true;
                      options.targetWidth = 250,
                      options.targetHeight = 250;
       }else{
             options.allowEdit = false;
       }

  		this.camera.getPicture(options).then((imageData) => {
                            this.imageUpload = 'data:image/jpeg;base64,' + imageData;
                            this.events.publish(data[0], {data: this.imageUpload});
                            this.email = data[2];
                               this.action = data[0];
                           if(data[0] == 'profile'){
        					         	params = [data[2]];
        									    this.imageUploadFunction(data, params);
        									 }
							     	}, err =>{
                           console.log(JSON.stringify(err));
                            this.events.publish(data[0]);
                            
                         });
                      });
		
  }
  callActon(data){
    data.owner = this.email;
    this.events.publish('CallResponse', {data: data});
  }

  
  

  storeDraft(data){
    var indexMessage = this.drafts.findIndex(k => k.id == data[0]);
       if(indexMessage !== -1){
          this.drafts[indexMessage].text = data[1];
       } else{
          this.drafts.push({
            id: data[0],
            text: data[1]
          });
       }
   
  }
  removeDraft(data){
    var draftIndex = this.drafts.findIndex(y => y.id == data);
    if(draftIndex !== -1){
       this.drafts.splice(draftIndex, 1);
    }
  }
  imageUploadFunction(data, params){
  	const fileTransfer: FileTransferObject = this.transfer.create();
        let options: FileUploadOptions = {
          fileKey: 'ionicfile',
          fileName: 'ionicfile',
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {},
          params: {data: data[0], owner: params[0], receiver: params[1], imageTime: params[2]}
          }
          this.showLoad();
   	fileTransfer.upload(this.imageUpload, this.url1+'imageUpload',  options)
          .then((datam) => {
        	 if(this.LoadController){
            this.LoadController.dismiss();
          }
          let datx:any = JSON.stringify(datam);
          let string = datx.split('\\"');
          if(this.action == 'profile'){
             this.showToast('Profile has been updated.');
            this.socketRequest({data:['updateProfileImage', this.email, string[1]]})
          }else if(this.action == 'sendImage'){
            var image = string[1].split('~');
             var   imagex = image[0];
               var imagetime = image[1]; 
            this.socketRequest({data:['updatemessageImage', imagex, imagetime]});
          }
        }, err => {
            	 if(this.LoadController){
                this.LoadController.dismiss();
              }
              console.log(JSON.stringify(err));
              this.showToast('Photo could not be uploaded');
              if(this.action == 'sendImage'){
                   this.socketRequest({data:['updatemessageImage']});
                    }
        });
  }

  presentPopover(myEvent, data) {
    let popover = this.popoverCtrl.create(ModelPage, {data: data});
    popover.present({
      ev: myEvent
    });
  }
  socketRequest1(data){
        var datax = data.data;
        datax.splice(4,1);
        datax.push(this.functionDate()[2]);
        var params = [datax[3], datax[2], this.functionDate()[2]];
        this.socket.emit('appData', data);
        this.imageUploadFunction(data, params);
  }
  showImage(data){
    this.photoViewer.show(data[0], data[1], {share: false});
  }

  socketRequest(data){
    var datax = data.data;
  	if(datax[0] == 'updateProfile' || datax[0] == 'randomMatch' || datax[0] == 'findMatch'){
 		 this.showLoad();
    }         
    	this.socket.emit('appData', data);
  }
showToast(msg){
 let toast = this.toastCtrl.create({
    message: msg,
    duration: 3000,
    position: 'middle'
  	});
   toast.present();
 }
showLoad(){
	this.LoadController = this.loadCtrl.create({
	    content: 'just a moment...'
	  })
	  this.LoadController.present();
	}
socketResponse(){
		let observable = new Observable( observer =>{
	      this.socket.on('serverData', data=>{
		          observer.next(data);
		      });
		    });
		      return observable;
		}
functionDate(){
		let day = new Date();
    let now = Date.now();
			let Todaydate = day.getDate() +'/'+ Math.floor(day.getMonth()+1) +  '/'+ day.getFullYear();
			let PreviousDate =  Math.floor(day.getDate()-1) +'/'+ Math.floor(day.getMonth()+1) + '/'+day.getFullYear();
			return [Todaydate, PreviousDate, now];
		}

}
