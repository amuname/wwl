var Msg,
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

function handleMessage(request, sender, sendResponse) {
	console.log(request);
	console.log(sender);
	if (sender.origin =='https://app.syncrm.ru') {
		console.log(sender.tab.id)
		sendResponse = ()=>{

			chrome.tabs.sendMessage(sender.tab.id,{a:true});
		}
	}
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


chrome.storage.sync.get(["APl"], function(result) {
          //console.log('Value currently is ' + result.APl);
          CrmAPI = result.APl;
        });

chrome.storage.sync.get(["ContactID"], function(result) {
          //console.log('Value currently is ' + result.ContactID);
          idForPost = result.ContactID;
        });

chrome.runtime.onMessage.addListener(handleMessage);

