let CrmAPI,
idForPost="";		
let newMailingRequest;

function handleMessage(request, sender, sendResponse) {

	// console.log(request);
	// console.log(request.mailing);
	// console.log(sender);
	if (sender.origin =='https://app.syncrm.ru') {
		// console.log(sender.tab.id)
		newMailingRequest = request.numbs;
		// console.log(newMailingRequest);
		if (request.mailing) {
			chrome.tabs.query({url:['*://app.syncrm.ru/*']},function(e){// отправляю каждой вкладке что рассылка начата
		   		// console.log(e);
		   		e.forEach((tab)=>{
		       		// console.log(tab.id);
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
	    		// console.log(e);
	    		e.forEach((tab)=>{
	        		// console.log(tab.id);
	        		chrome.tabs.sendMessage(tab.id,{'mailing':false});
	    		});
			});
		}
		if (request.customer&&request.content_whatsapp_casual_message.length>=4&&request.customer_number.length>=11){//передай customer_number
			send_message_2_CRM('Клиент :',request.content_whatsapp_casual_message,request.customer_number)
		}
		else if (!request.customer&&request.content_whatsapp_casual_message.length>=4&&request.customer_number.length>=11){
			send_message_2_CRM('Оператор :',request.content_whatsapp_casual_message,request.customer_number)	
		}
	}

	async function send_message_2_CRM(sender,message,phone_number) {
		if (!CrmAPI) {
			chrome.storage.sync.get(["APl"], function(result) {
          	// console.log('Value currently is ' + result.APl);
          	CrmAPI = result.APl;
        	});
		}
		const url = 'https://app.syncrm.ru/api/v1/contacts',
		headers = {
	    	'Content-Type': 'application/vnd.api+json',
	    	'Authorization': `Bearer ${CrmAPI}`
	    };
	    // console.log(headers);
		async function get_filter(){
			const filter = `?filter%5Bany_phone%5D=%2B${phone_number}`,
			options_filter = {
				method: 'GET',
				headers: headers,
			},
			filter_phone = await fetch(url+filter,options_filter);
			filter_result = await filter_phone.json();
			// console.log(filter_result.data);
			// id = await filter_phone.json().data.id	hz chto dalshe, nado zapuskat
			// send_message() 
			filter_result.data.forEach(e=>send_message(e.id,' <p>\r\n'+sender+' <p>\r\n'+message))
		}
		async function send_message(id,msg){
			//!!!!!!!!!!!!!!!!!!!

			//переписать дату под уведомления(активити)[если конечно надо, вроде и так хорошо, да и у нас API нет]

			//!!!!!!!!!!!!!!!!!!!
			const options_description = {
				method: 'GET',
				headers: headers,
			};

			const descriptio_response = await fetch(url+'/'+id,options_description)
			const description_to_patch = await descriptio_response.json()
			const old_desc = description_to_patch.data.attributes.description+'\n'
			// console.log(old_desc);
			let data = {
				data:{
         			'type':'contacts',
         			'id':id,
         			'attributes':{
           				'description':old_desc+msg,
         			}
				}
			};
			const options_message = {
				method: 'PATCH',
				headers: headers,
				body:JSON.stringify(data) 
			}
			const response = await fetch(url+'/'+id,options_message)
			const r_r = await response.json();
		}
		get_filter()
	}

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

