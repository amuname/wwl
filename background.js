var Msg,
senderNumber,
CrmAPI,
idForPost,
url = "https://app.syncrm.ru/api/v1/contacts",
filter = "?filter%5Bany_phone%5D=%2B",
fulFilter,
header1name = "Content-Type",
header1val = "application/vnd.api+json",
header2name = "Authorization",
header2val,
data,
xhr = new XMLHttpRequest,
xhrPatch =new XMLHttpRequest,
xhrFil =new XMLHttpRequest;
console.log(Msg);
console.log(senderNumber);
// 	console.log("wow")
// chrome.runtime.sendMessage("hello");


function handleMessage(request, sender, sendResponse) {
		Msg = request.slice(0,-11);
    	senderNumber = request.slice(-11);
        console.log(Msg);
        console.log(sender);
        chrome.storage.sync.get(["APl"], function(result) {
          	console.log('Value currently is ' + result.APl);
          	CrmAPI = result.APl;
            if (CrmAPI!==undefined) {
            	// if (idForPost ==undefined) {
     //      			chrome.storage.sync.get(["ContactID"], function(result) {
     //      			console.log('Value currently is ' + result.ContactID);
     //      			idForPost = result.ContactID;
     //    			});

					// header2val= "Bearer "+CrmAPI;
     //    			getInfoCrm();
     //      		} else {
     //      			chrome.storage.sync.get(["ContactID"], function(result) {
     //      			console.log('Value currently is ' + result.ContactID);
     //      			idForPost = result.ContactID;
     //    			});
	         	fulFilter = filter+senderNumber;
	         	//    console.log(fulFilter);
	        	header2val= "Bearer "+CrmAPI;
	        	
	        	// console.log(CrmAPI);
	        		filterBool();
	        		
	        	 // }
			}
        });

}

function filterBool() {
	xhrFil.open("GET", url+fulFilter)
	xhrFil.setRequestHeader(header1name,header1val);
	xhrFil.setRequestHeader(header2name,header2val);
	xhrFil.send();
	xhrFil.onload = ()=> {
		let r = JSON.parse(xhrFil.response);
		/*if (r.data.length==0) {
			chrome.runtime.sendMessage("NaN");
		}*/
		if (r.data.length==1) {
			idForPost = r.data[0].id;
			getInfoCrm();
		}
		if (r.data.length>1) {
			for (var i =  r.data.length - 1; i >= 0; i--) {
				let data =r.data[i];
				if (data.attributes.description!==null&&idForPost!==data.id){
					idForPost = data.id;
					getInfoCrm();
				} else if(idForPost!==data.id){
					idForPost = data.id;
					getInfoCrm();
				}
			}
		}
	}
}

function getInfoCrm() {
	// chrome.storage.sync.get(["ContactID"], function(result) {
 //    console.log('Value ID is ' + result.ContactID);
 //    idForPost = result.ContactID;
    	data = JSON.stringify({
			"data": {
			"type":"contacts",
			"id":idForPost,
				"attributes":{
				"description": Msg
			}
		}
	});
	xhr.open("GET",url+"/"+idForPost);
	xhr.setRequestHeader(header1name,header1val);
	xhr.setRequestHeader(header2name,header2val);
	xhr.send();
	xhr.onload = () =>{
		var description;
		//console.log(xhr);
		var r = JSON.parse(xhr.response);
		//console.log(r);
		//console.log(r.data.attributes.description);
		description = r.data.attributes.description;
		if (description==null||description=="") {
			xhrPatch.open("PATCH",url+"/"+idForPost);
			xhrPatch.setRequestHeader(header1name,header1val);
			xhrPatch.setRequestHeader(header2name,header2val);
			xhrPatch.send(data);
		}else {
			
			var oldMsg =description.slice(-Msg.length);
			//console.log(oldMsg);
			if (oldMsg!==Msg) {
				newMsg = description+" <p>"+Msg;
				data = JSON.stringify({
				  "data": {
					  "type":"contacts",
					  "id":idForPost,
					  "attributes":{
					    "description": newMsg
				      }
				   }
				});
			xhrPatch.open("PATCH",url+"/"+idForPost);
			xhrPatch.setRequestHeader(header1name,header1val);
			xhrPatch.setRequestHeader(header2name,header2val);
			xhrPatch.send(data);
			}

		}
	}
    // });


}

// function postToCrm(argument) {
// 	// body...
// }

chrome.storage.sync.get(["APl"], function(result) {
          //console.log('Value currently is ' + result.APl);
          CrmAPI = result.APl;
        });

chrome.storage.sync.get(["ContactID"], function(result) {
          //console.log('Value currently is ' + result.ContactID);
          idForPost = result.ContactID;
        });

chrome.runtime.onMessage.addListener(handleMessage);
