import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import* as Jq from 'jquery';
import { ProviderPage } from '../provider/provider';
import { SendPicPage } from '../send-pic/send-pic';
import { ReportPage } from '../report/report';



@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
	message: string;
	friendInfo: any;
	messages: any = [];
	dateCheck: any; 
	myId: string;
	myInfo: any;
	firstMess: number;
	lastMess: number;
	block: boolean = false;
	modalx: any;
	deleteChats: any = [];
	Fetching: boolean = false;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public events: Events, public navParams: NavParams, public provider: ProviderPage) {
    this.dateCheck = this.provider.functionDate();
  	this.friendInfo = this.navParams.get('friendInfo');
  	this.myInfo = this.navParams.get('myInfo');
  	if(this.friendInfo.More && (this.friendInfo.More.Block == 'Unblock' || this.friendInfo.More.Block == 'Blocked')){
  		this.block = true;
  	}
     var indexMessage = this.provider.drafts.findIndex(k => k.id == this.friendInfo.Email);
       if(indexMessage !== -1){
       	 this.message = this.provider.drafts[indexMessage].text;
       } 
  	this.myId = this.myInfo.Email;
	  		this.provider.socketRequest({data: ['fetchFirstmess', this.myId, this.friendInfo.Email]})
           this.modalx =  this.modalCtrl.create(ReportPage, {data: [this.myInfo, this.friendInfo]});
      this.events.subscribe('MessageReception', (info)=>{
      	var data = info.data;
	      	switch (data[0]) {
	      		case "messageSent":
					let friendx:any = this.friendInfo;
					if((data[1].from == this.myId && data[1].to == friendx.Email) || (data[1].to == this.myId && data[1].from == friendx.Email)) {
	      			 	this.messages.push(data[1]);
	      			 	 Jq(".textDivision").scrollTop(1E10);
	      			 	 if(data[1].from == this.myId){
			             this.message = '';
		 				}
		 				 this.provider.socketRequest({data: ['updateRead', this.myId, friendx.Email]});
					}
	      			break;
	      		case 'updateRead':
					let friend:any = this.friendInfo;
	      			 if(data[1][2] == this.myId && data[1][1] == friend.Email){
	      			 	this.messages.forEach(function(mess){
	      			 		mess.read = true;
	      			 	})
	      			 }
	      			break;
	  			case 'fetchFirstmess':
	  			      this.messages = data[1];
	  			      if(data[2]){
			  			      this.firstMess = data[2].id;
			  			  }
		         case 'fetchSubsequent':
		         		let messages = this.messages;
		         		data[1].forEach(function(dax){
		         			if(messages.findIndex(m => m.id == dax.id) == -1){
		         				messages.unshift(dax);
		         			}
		         		})
				     this.Fetching = false
	      	
	      			break;
      			case 'updateDeletedMessages':
                       var mx = data[1][3];
                       var mess = this.messages;
                       mx.map(function(v){
                         var y = mess.findIndex(m => m.id == v);
                         if(y !== -1){
                         	mess.splice(y, 1);
                         }

                       })
                       this.deleteChats = [];
      				   break;
	      	}
	      })
      this.events.subscribe('modelAction', (data)=>{
      	var action = data.data;
      	if(action == 'Report') {
      		if(this.modalx){
	           this.modalx.present();
               this.modalx = undefined;
	       }
  		}else{
	 		this.provider.socketRequest({data: ['friendAction', action, this.myId, this.friendInfo.Email]});
  		}
      });
      this.events.subscribe('FriendResponse', (data)=>{
	   	var datam = data.data;
	   	if(datam){
            switch (datam[0]) {
            	case "Block":
            		  if((datam[3] == this.myId && datam[4] == this.friendInfo.Email) || (datam[4] == this.myId && datam[3] == this.friendInfo.Email) ){
	  	 					this.block = true;
            		  }
            		break;
        		case "Unblock":
	        		  if((datam[2] == this.myId && datam[3] == this.friendInfo.Email) || (datam[3] == this.myId && datam[2] == this.friendInfo.Email) ){
	  	 					this.block = false;
	        		  }
        		break;
        		case 'Deletechat':
	        		     if(datam[1] == this.myId && datam[2] == this.friendInfo.Email ){
		  	 					this.messages = [];
		        		  }
	        		break;
            	
            };
        }
	   })

      this.events.subscribe('friendResponse', (data) =>{
      	if(data && (data.Block == 'Unblock' || data.Block == 'Blocked')){
	  	 		this.block = true;
	  	 }else{
	  	 		this.block = false;
	  	 }
      })
      this.events.subscribe('profileImageUpdated', (data)=>{
	   	   if(data.owner == this.friendInfo.Email){
                this.friendInfo.Profile_pic = data.image;
	   	   }
	   	});
   
      this.events.subscribe('updateMessageImage', (data)=>{
      	let datam = data.data;
      	 let indexy =  this.messages.findIndex(y => y.image == datam[2]);
      	 if(indexy !== -1){
      	 	this.messages[indexy].image = datam[1];
      	 }
      })
  }
  showImage(data){
  	if(this.deleteChats.length == 0){
  		this.provider.showImage(data);
  	}
  }
  selectMessage(id){
      Jq('#'+id+'').addClass('selectedText');
      this.deleteChats.push(id);
  }
  clickMessage(id){
  	  var indexOfText = this.deleteChats.indexOf(id);
    if(this.deleteChats.length > 0 && indexOfText == -1 ){
    	 Jq('#'+id+'').addClass('selectedText');
         this.deleteChats.push(id);
    }else{
    	 Jq('#'+id+'').removeClass('selectedText');
         this.deleteChats.splice(indexOfText, 1);

    }
  }
  ionViewDidLeave(){
	this.provider.socketRequest({data: ['updateRead', this.myId, this.friendInfo.Email]});
  	this.deleteChats = [];
  	if(this.message && this.message.trim() !== ''){
  		this.provider.storeDraft([this.friendInfo.Email, this.message]);
  	}else{
  		this.provider.removeDraft(this.friendInfo.Email);
  	}
  	this.friendInfo = '';
  	this.myId ='';
  }
  ionViewDidLoad(){
	 if(this.myId && this.messages.length > 0){
	 		this.provider.socketRequest({data: ['updateRead', this.myId, this.friendInfo.Email]});
	  	}
  }
gotScrolled(event){
    this.lastMess = this.messages[0].id;
	if(Jq('#content').scrollTop() == 0 && this.lastMess !== this.firstMess){
		this.Fetching = true;
		console.log(this.lastMess +' ++ '+ this.firstMess)
		this.provider.socketRequest({data: ['fetchSubsequent', this.myId, this.friendInfo.Email, this.lastMess]});
	}
}
readAll(){
 	this.provider.socketRequest({data: ['updateRead', this.myId, this.friendInfo.Email]});
}
 sendMessage(message){
 	this.provider.socketRequest({data: ['messageSent',message, this.friendInfo, this.myInfo]});
 }

  presentPopover(myEvent, data) {
   this.provider.presentPopover(myEvent, data);
  }
  takePicture(data){
  	     let profileModal = this.modalCtrl.create(SendPicPage, {friendInfo: this.friendInfo, myInfo: this.myInfo, image: ''});
						   profileModal.present();
	 	this.events.publish('uploadingImage', {data: data});

  }
  handleSelection(event) {
  if(this.message == undefined ){
      this.message = '';
    }
    this.message = this.message + " " + event.char;
  }

}
