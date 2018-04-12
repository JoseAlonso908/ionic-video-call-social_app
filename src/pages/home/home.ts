import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, Events, NavParams, ModalController } from 'ionic-angular';
import* as Jq from 'jquery';
import { ProviderPage } from '../provider/provider';
import * as contry from 'countries-cities';
import { IndexPage } from '../index/index';
import { ImagePage } from '../image/image';
import { Storage }from '@ionic/storage';
import { DatePage } from '../date/date';
import { ChatPage } from '../chat/chat';
import { CallsPage } from '../calls/calls';
import { CallPage } from '../call/call';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	@ViewChild(Slides) slides: Slides;
	searchValue: string;
	profileinfo: any;
	profileinfo2: any;
	profileComplete: boolean = false;
	countries: any;
	holder: any;
	countries1: any;
	country: string;
	cities: any;
	dateCheck: any;
	city: string;
	email: string;
	accountInfo: any;
	age: string;
	matchData: string;
	age1: string;
	gender: string;
	orientation: string;
	intension: string;
	intension1: string;
	city1: string;
	country1: string;
	cities1: any;
	friends: any =[];
	chats: any = [];
  constructor(public storage: Storage, public modalCtrl: ModalController, public navCtrl: NavController,
    public navParams: NavParams, public events: Events, public provider: ProviderPage) {
    this.dateCheck = this.provider.functionDate();
	    storage.ready().then(() => {
             storage.get('blindyVariables').then((val) => {
               if(val){
                 let info = JSON.parse(val);
                 this.email = info.email;
                 var em = this.email;
                 setTimeout(function(){
	   				provider.socketRequest({data:['fetchUserInfo', em]});
		  		},500)
             }
             }, err=>{
             	console.log(err);
             });
         },err=>{
         	console.log(err);
         });
   this.profileinfo = [
	   {title: 'What is your age range?',options:['18 - 29', '30 - 59', '60 - 90']},
	   {title: 'What is your gender?',options:['Male', 'Female']},
	   {title: 'What is your orientation?',options:['Straight', 'Gay']},
	   {title: 'What are you interested in?',options:['Just for fun', 'New friends', 'Dating', 'Long term']}];
   this.profileinfo2 = [
	   {title: 'What should your match age range be?',options:['18 - 29', '30 - 59', '60 - 90']},
	   {title: 'What should your match be interested in?',options:['Just for fun', 'New friends', 'Dating', 'Long term'], module: 'intension'}]
	   this.countries = contry.getCountries().sort();
	   this.countries1 = contry.getCountries().sort();
	   this.events.subscribe('modelAction', (data)=>{
    		var action =  data.data;
    		 let profileModal
	    		switch (action) {
			 		case "Log out":
			 		this.storage.remove('blindyVariables').then(()=>{
			 			this.navCtrl.setRoot(IndexPage);
				          }).catch(function (err) {
				              console.log(err);
				          });
			 			break;
		 			case "Call logs":
		 				  profileModal = this.modalCtrl.create(CallsPage);
						   profileModal.present();
		 				break;
	 				case "My account":
		 				  profileModal = this.modalCtrl.create(ImagePage, {data: [this.accountInfo, this.provider.url]});
						   profileModal.present();
		 				break;
			 		
			 		
			 		}
	        });
	   this.events.subscribe('HomeEvents', (datam) =>{
	   		switch (datam.info[0]) {
	   			case "userBasic":
	   				    this.accountInfo = datam.info[1];
				   		this.profileComplete =  this.accountInfo.Profile;
				   		if(this.profileComplete == true){
			                this.age = this.accountInfo.age;
			                this.age1 = this.accountInfo.age;
			                this.gender = this.accountInfo.gender;
			                this.orientation = this.accountInfo.orientation;
			                this.intension = this.accountInfo.intention;
			                this.intension1 = this.accountInfo.intention;
			                this.country1 = this.accountInfo.country;
			                this.country = this.accountInfo.country;
			                this.city1 = this.accountInfo.city;
			                this.city = this.accountInfo.city;
				   			this.cities = contry.getCities(this.country).sort();
				   			this.cities1 = contry.getCities(this.country1).sort();
				   		}
	   				break;
	   			case 'dateFound':
						   let profileModal = this.modalCtrl.create(DatePage, {data: datam.info[1], myInfo: this.accountInfo});
						   profileModal.present();
	   				break;
   				case 'friendChat':
   					  this.chats.push(datam.info[1]);
   					  this.chats = this.chats.sort(function (a, b) {
                                  return b.time - a.time;
                      });
   					  if(datam.info[1].more.Status !== 'Add to friends'){
   					  	this.friends.push(datam.info[1]);
   					  	this.friends = this.friends.sort(function (a, b) {
                                  return b.time - a.time;
                      });
   					  }
	   		}
	         })
	   this.events.subscribe('MessageReception', (datam) =>{
   		   var data = datam.data;
   		   var index;
      		switch (data[0]) {
      		case "messageSent":
      		    var sender = data[2];
      		    var receiver = data[3];
      		    var newChat; 
      		    if(sender.id == this.email){
      		    		 index = this.chats.findIndex(m => m.id == receiver.id);
      		    		if(index > -1 ){
	 				 		this.chats[index].unread = 0;
	 				 		this.chats[index].message = data[1];
	 				 		newChat = this.chats[index];
	 				 		this.chats.splice(index, 1);
	 				 		this.chats.unshift(newChat);
	 				 	}else{
	 				 		this.chats.unshift(receiver);
	 				 	}
      		    }else if(receiver.id == this.email){
 				  var index1 = this.chats.findIndex(m => m.id == sender.id);
      		    	 if(index1 >-1){
	 				 		this.chats[index1].unread += 1;
	 				 		this.chats[index1].message = data[1];
	 				 		 newChat = this.chats[index1];
	 				 		this.chats.splice(index1, 1);
	 				 		this.chats.unshift(newChat);

	 				 	}else{
	 				 		this.chats.unshift(sender);
	 				 	}
      		    }
 				  
  			break;
      		case 'updateRead':
      		 index;
      				if(data[1][1] == this.email){
  				         index = this.chats.findIndex(m => m.id == data[1][2]);
  				        if((index > -1) && (this.chats[index].message && this.chats[index].message.from == data[1][2] && this.chats[index].message.to == this.email)){
  				        	this.chats[index].unread = 0;
  				       } 

      				}else if(data[1][2] == this.email){
  				         index = this.chats.findIndex(m => m.id == data[1][1]);
  				         if((index > -1) && (this.chats[index].message && this.chats[index].message.from == this.email && this.chats[index].message.to == data[1][2])){
  				        	this.chats[index].message.read = true;
  				       } 
      				}
      			break;
      		}
     	  });
     this.events.subscribe('CallResponse', (data)=>{
         this.navCtrl.push(CallPage, data);
     })
	   this.events.subscribe('FriendResponse', (data)=>{
	   	var datam = data.data;
	   	 var indexFriend;
		  var status;
		  if(datam){
            switch (datam[0]) {
            	case "requestAdd":
            		  if(datam[3] == this.email){
                          indexFriend = this.chats.findIndex(y => y.more.Id == datam[4]);
                         status = 'Remove request';
            		  }else if(datam[4] == this.email){
            		  	  indexFriend = this.chats.findIndex(y => y.more.Id == datam[3]);
                         status = 'Accept';
            		  }
            		  if(indexFriend !== undefined){
		            		this.chats[indexFriend].more.Status = status;
		            		this.friends.push(this.chats[indexFriend]);
		            	}
            		break;
            	case 'requestRemove':
	            	
            	      if(datam[2] == this.email){
                          indexFriend = this.friends.findIndex(y => y.more.Id == datam[3]);
            			 this.friends.splice(indexFriend, 1);

            		  }else if(datam[3] == this.email){
            		  	  indexFriend = this.friends.findIndex(y => y.more.Id == datam[2]);
            		 	 this.friends.splice(indexFriend, 1);

            		  }
            			break;
    			case 'acceptedRequest':
    			      if(datam[2] == this.email){
                          indexFriend = this.friends.findIndex(y => y.more.Id == datam[3]);
            		  }else if(datam[3] == this.email){
            		  	  indexFriend = this.friends.findIndex(y => y.more.Id == datam[2]);
            		  }
            		 this.friends[indexFriend].more.Status = datam[1];
    					break;
            	case "Block":
            		  if(datam[3] == this.email){
                           for(let m = 0; m < this.chats.length; m++){
                           	   if(this.chats[m].id == datam[4]){
                           	   	  this.chats[m].more.Block = 'Unblock';
                           	   }
                           }
                             for(let m = 0; m < this.friends.length; m++){
                           	   if(this.friends[m].id == datam[4]){
                           	   	  this.friends[m].more.Block = 'Unblock'
                           	   }
                           }
            		  }else if(datam[4] == this.email){
            		  		 for(let m = 0; m < this.chats.length; m++){
                           	   if(this.chats[m].id == datam[3]){
                           	   	  this.chats[m].more.Block = 'Blocked'
                           	   }
                           }
                             for(let m = 0; m < this.friends.length; m++){
                           	   if(this.friends[m].id == datam[3]){
                           	   	  this.friends[m].more.Block = 'Blocked'
                           	   }
                           }
            		  }
            		break;
        		case "Unblock":
	        		 if(datam[2] == this.email){
                           for(let m = 0; m < this.chats.length; m++){
                           	   if(this.chats[m].id == datam[3]){
                           	   	  this.chats[m].more.Block = 'Block'
                           	   }
                           }
                             for(let m = 0; m < this.friends.length; m++){
                           	   if(this.friends[m].id == datam[3]){
                           	   	  this.friends[m].more.Block = 'Block'
                           	   }
                           }
            		  }else if(datam[3] == this.email){
            		  		 for(let m = 0; m < this.chats.length; m++){
                           	   if(this.chats[m].id == datam[2]){
                           	   	  this.chats[m].more.Block = 'Block'
                           	   }
                           }
                             for(let m = 0; m < this.friends.length; m++){
                           	   if(this.friends[m].id == datam[2]){
                           	   	  this.friends[m].more.Block = 'Block'
                           	   }
                           }
            		  }
        		break;
        		
            	
            	
            };
        }
	   })
	   this.events.subscribe('profileImageUpdated', (data)=>{
	   	   if(data.owner == this.accountInfo.Email){
                this.accountInfo.Profile_pic = data.image;
	   	   }else{
	   	   	  var ind1 = this.friends.findIndex(n => n.id == data.owner);
	   	   	  var ind2 = this.chats.findIndex(n => n.id == data.owner);
                if(ind1 !== -1){
                	this.friends[ind1].image = data.image;
                }

                if(ind2 !== -1){
                	this.chats[ind2].image = data.image;
                }
	   	   }
	   });
  }
  imageclicked(user){
  	if(user.more.Status == 'Unfriend'){
  		this.provider.showImage([user.image]);
  	}
  }
  friendClicked(info){
  		    var friend = info[1];
  		    var friendInfo = {
  				userName: friend.name,
  				Profile_pic: friend.image,
  				Email: friend.id,
  				More: friend.more
  			}
  	switch (info[0]) {
  		case "chat":
  			  this.navCtrl.push(ChatPage, {friendInfo: friendInfo, myInfo: this.accountInfo});
  			break;
  		
  		default:
  			// code...
  			break;
  	}
  }
 action(action){
		this.provider.socketRequest({data: ['friendAction', action[0], this.email, action[1]]});
 }
  submit(data){
  	let info = ['updateProfile',this.email]
  	info = info.concat(data);
  	this.provider.socketRequest({data: info});
  }
  submit1(data){
  	this.provider.socketRequest({data: data});
  }
  countryChanged(country){
  	this.cities = contry.getCities(country).sort();
    this.city = this.cities[0];
  }
   countryChanged1(country){
  	this.cities1= contry.getCities(country).sort();
    this.city1 = this.cities1[0];
  }
	search(hide, show, actn){
		Jq('#'+hide+', .slideDiv').slideUp(300,function(){
			Jq('#'+show+'').toggle();
		})
		var activeSlide = this.slides.getActiveIndex();
		this.slides.lockSwipes(true);
		if(actn == 'srch'){
			switch (activeSlide) {
				case 1:
					this.holder = this.friends;
					break;
				case 2:
					this.holder = this.chats;
					break;
				
			};
		}else{
			Jq('.slideDiv').show();
		this.slides.lockSwipes(false);
			this.searchValue = '';
			this.slideData(activeSlide);
			this.holder =[];
        		this.matchData = '';


		}
	}
	searchFunction(searchValue){
		var activeSlide = this.slides.getActiveIndex();
		if(searchValue.trim() == ''){
			this.slideData(activeSlide);
		}else if(searchValue.trim() !== '' && activeSlide == 2){
        	this.chats =  search(this.holder, searchValue);
        	if(this.chats.length == 0){
        		this.matchData = 'matching';
        	}
           
        }else if(searchValue.trim() !== '' && activeSlide == 1){
            this.friends =  search(this.holder, searchValue);
        	if(this.friends.length == 0){
        		this.matchData = 'matching';
        	}
        }
	}
  slideData(activeSlide){
        switch (activeSlide) {
				case 1:
					this.friends  = this.holder;
					break;
				case 2:
					this.chats = this.holder;
					break;
				
			};
  }
	clearSearch(){
		this.searchValue = '';
		var activeSlide = this.slides.getActiveIndex();
		switch (activeSlide) {
				case 1:
					this.friends  = this.holder;
					break;
				case 2:
					this.chats = this.holder;
					break;
				
			};
	}
	slideChanged(){
		Jq('#Header').slideDown(600);
		Jq('#Header2').slideUp(600);
		var pos = this.slides.getActiveIndex();
		if(pos < 4){
			Jq('.active').removeClass('active');
			Jq('.cls'+pos+'').addClass('active');
		}
		if((pos == 1 && this.friends.length >1) || pos == 2 ){
			Jq('.search1').show();
			Jq('#blindy').show(200);
		}else{
			Jq('.search1').hide();

		}
	}
	switchSlide(pos){
		this.slides.slideTo(pos, 600);
	}
	gotScrolled(event, div){
		var pos = 0;
		var scroll = Jq("#"+div+"").scrollTop();
		if((pos - scroll) < pos){
				Jq('#blindy').slideUp(100);
		}else{
				Jq('#blindy').slideDown(100);
		}
		pos = scroll;
	}
	presentPopover(myEvent,data){
       this.provider.presentPopover(myEvent, data);

	}
}
function search(array, value){
     var returnValue = [];
     var arry = array;
     arry.map(function(y){
     	var index = y.name.toLowerCase().indexOf(value.toLowerCase());
       if(index !== -1){
       	returnValue.push(y);
       }
     })

     return returnValue;

}
