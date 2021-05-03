let Msg,
senderNumber,
CrmAPI,
idForPost="",
url = "https://app.syncrm.ru/api/v1/contacts",
filter = "?filter%5Bany_phone%5D=%2B",
fulFilter,
header1name = "Content-Type",
header1val = "application/vnd.api+json",
header2name = "Authorization",
header2val,
data,
lengthmsg="", 
description,
xhr = new XMLHttpRequest,
xhrPatch =new XMLHttpRequest,
xhrFil =new XMLHttpRequest;
		
let newMailingRequest;

function handleMessage(request, sender, sendResponse) {


	console.log(request);
	console.log(request.mailing);
	console.log(sender);
	if (sender.origin =='https://app.syncrm.ru') {
		console.log(sender.tab.id)
		newMailingRequest = request.numbs;
		console.log(newMailingRequest);
		if (request.mailing) {
			chrome.tabs.query({url:['*://app.syncrm.ru/*']},function(e){// отправляю каждой вкладке что рассылка начата
		   		console.log(e);
		   		e.forEach((tab)=>{
		       		console.log(tab.id);
		       		chrome.tabs.sendMessage(tab.id,{'mailing':true});
		   		});
			});
		}
		sendResponse({a:true});
	}
	if (sender.origin =='https://web.whatsapp.com') {
		if (request.mailing) {
		}
		if (!request.mailing&&!request.customer&&!request.content_whatsapp_casual_message) {
			chrome.tabs.query({url:['*://app.syncrm.ru/*']},function(e){// отправляю каждой вкладке что рассылка закончена
	    		console.log(e);
	    		e.forEach((tab)=>{
	        		console.log(tab.id);
	        		chrome.tabs.sendMessage(tab.id,{'mailing':false});
	    		});
			});
		}
		if (request.customer&&request.content_whatsapp_casual_message.length>=4&&request.customer_number.length>=11){//передай customer_number
			send_message_2_CRM('Клинет',request.content_whatsapp_casual_message,request.customer_number)
		}
		else if (!request.customer&&request.content_whatsapp_casual_message.length>=4&&request.customer_number.length>=11){
			send_message_2_CRM('Оператор',request.content_whatsapp_casual_message,request.customer_number)	
		}
	}


	async function send_message_2_CRM(sender,message,phone_number) {debugger
		if (!CrmAPI) {
			chrome.storage.sync.get(["APl"], function(result) {
          	console.log('Value currently is ' + result.APl);
          	CrmAPI = result.APl;
        	});
		}
		const url = 'https://app.syncrm.ru/api/v1/contacts',
		headers = {
	    	'Content-Type': 'application/vnd.api+json',
	    	'Authorization': `Bearer ${CrmAPI}`
	    };
	    console.log(headers);
		async function get_filter(){
			const filter = `?filter%5Bany_phone%5D=%2B${phone_number}`,
			options_filter = {
				method: 'GET',
				headers: headers,
			},
			filter_phone = await fetch(url+filter,options_filter);
			console.log(filter_phone);
			// id = await filter_phone.json().data.id	hz chto dalshe, nado zapuskat
			// send_message()
		}
		async function send_message(data){
			const options_message = {
			method: 'POST',
			headers: headers,
			body:JSON.stringify(data) 
			}
		}
		get_filter()
	}



// options_message = {
// 			method: 'POST',
// 			headers: headers,
// 			body:JSON.stringify(data) 
// 		},

// 	if (lengthmsg=="") {
// 		lengthmsg = request;
// 		console.log(lengthmsg);
// 	} else {
// 			console.log("another one")
// 			Msg = request.slice(0,-11);
// 	    	senderNumber = request.slice(-11);
// 	        chrome.storage.sync.get(["APl"], function(result) {
// 	          	//console.log('Value currently is ' + result.APl);
// 	          	CrmAPI = result.APl;
// 	            if (CrmAPI!==undefined) {
// 	         	fulFilter = filter+senderNumber;
// 	        	header2val= "Bearer "+CrmAPI;
// 	        	filterBool(lengthmsg).then(toProm);
// 	        }
//         });
// 	}
// }

// function filterBool(msgLength) {
// 	msgLength=parseInt(msgLength)+8;
// 	console.log(msgLength);
// 	return new Promise(function(resolve,reject){
// 		xhrFil.open("GET", url+fulFilter)
// 		xhrFil.setRequestHeader(header1name,header1val);
// 		xhrFil.setRequestHeader(header2name,header2val);
// 		xhrFil.onload = ()=> {
// 			let argToProm = JSON.parse(xhrFil.response)
// 			resolve({argToProm,msgLength});
// 		}
// 		xhrFil.send();
// 	})
// }

// function toProm(r){
// 	console.log(r.argToProm);
// 	console.log(r.msgLength);
// 	console.log(r.argToProm.data.length);
// 	for (let i =  r.argToProm.data.length - 1; i >= 0; i--) {
// 		let d =r.argToProm.data[i];
// 		console.log(`GONA Send to id ${d.id} next`);
// 		description = d.attributes.description;
// 		console.log(description);
// 		idForPost = d.id;
// 		getInfoCrm(r.msgLength);
// 	}
// }

// function getInfoCrm(realLength) {
// 	lengthmsg="";
//     	data = JSON.stringify({
// 			"data": {
// 			"type":"contacts",
// 			"id":idForPost,
// 				"attributes":{
// 				"description": Msg
// 			}
// 		}
// 	});

// 		if (description===null&&typeof description===('object')||description=="") {
// 			xhrPatch.open("PATCH",url+"/"+idForPost, false);
// 			xhrPatch.setRequestHeader(header1name,header1val);
// 			xhrPatch.setRequestHeader(header2name,header2val);
// 			xhrPatch.send(data);
// 		}else if (description.length<=Msg.length) {
// 			let newMsg= description+Msg.slice(-realLength);
// 			console.log(newMsg);
// 			data = JSON.stringify({
// 				  "data": {
// 					  "type":"contacts",
// 					  "id":idForPost,
// 					  "attributes":{
// 					    "description": newMsg
// 				      }
// 				   }
// 				});
// 			xhrPatch.open("PATCH",url+"/"+idForPost, false);
// 			xhrPatch.setRequestHeader(header1name,header1val);
// 			xhrPatch.setRequestHeader(header2name,header2val);
// 			xhrPatch.onload = ()=>{
// 				console.log(JSON.parse(xhrPatch.response));
// 			}
// 			xhrPatch.send(data);
// 		} else {
// 			var oldMsg =Msg.slice(description.length);
// 			if (oldMsg!==Msg) {
// 				let newMsg = description+ Msg.slice(-description.length);
// 				console.log(newMsg);
// 				data = JSON.stringify({
// 				  "data": {
// 					  "type":"contacts",
// 					  "id":idForPost,
// 					  "attributes":{
// 					    "description": newMsg
// 				      }
// 				   }
// 				});
// 			xhrPatch.open("PATCH",url+"/"+idForPost, false);
// 			xhrPatch.setRequestHeader(header1name,header1val);
// 			xhrPatch.setRequestHeader(header2name,header2val);
// 			xhrPatch.send(data);
// 			}

// 		}

}	
// chrome.storage.sync.set({'API':'5fa630c6ffb801b9138c5e2573cd3e64ae435a2f3afb5c821c166ecdfa368bbb'})
	chrome.storage.sync.get(["APl"], function(result) {
          //console.log('Value currently is ' + result.APl);
          CrmAPI = result.APl;
        });

	chrome.storage.sync.get(["ContactID"], function(result) {
          //console.log('Value currently is ' + result.ContactID);
          idForPost = result.ContactID;
        });

chrome.runtime.onMessage.addListener(handleMessage);

