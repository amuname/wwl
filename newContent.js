const getToken = ()=>{chrome.storage.sync.get(["APl"], function(result) {
    // console.log('Value currently is ' + result.APl);
    if (!result.APl){//make alert Menu if token not defined
    	const alert = document.createElement('div');
    	alert.style.position = 'fixed';
    	alert.style.bottom = '3em';
    	alert.style.right = '5em';
    	alert.style.zIndex = '999';
    	alert.style.opacity= '0.2';
    	alert.style.transition = 'all .2s ease-out';
    	alert.insertAdjacentHTML('beforeend',`<div style="font-family: inherit;cursor: pointer;"><div style="padding: 5px;background: linear-gradient(0.26turn,#43d854,blue);"><div style="background-color: #fff;color: #7F7F7F;padding: 17px;">
			<a style="float: right;width: 26px;height: 26px;background: transparent repeat top left;margin-top: -30px;margin-right: -30px;">
			</a>
			<h1 style="display: block;font-size: 2em;margin-block-start: 0.67em;margin-block-end: 0.67em;margin-inline-start: 0px;margin-inline-end: 0px;font-weight: bold;">Установите API токен</h1>
			<p style="display: block;margin-block-start: 1em;margin-block-end: 1em;margin-inline-start: 0px;margin-inline-end: 0px;">Откройте расширение и завершите настройку</p>
			</div></div></div>`);
    	document.getElementsByTagName('body')[0].appendChild(alert);
    	alert.addEventListener('mouseover', function(e) {
			alert.style.opacity= '1';
			alert.firstChild.firstChild.style.background = 'linear-gradient(0.6turn,#43d854,blue)';
    	});
    	alert.addEventListener('mouseout', function(e) {
    		alert.style.opacity= '0.2';
			alert.firstChild.firstChild.style.background = 'linear-gradient(0.26turn,#43d854,blue)';
    	});
    	alert.addEventListener('click', function(e) {
    		window.location.reload();
    	});
    }
});
}
 //if token defined starting main(content) script
    	if (window.location.host == "app.syncrm.ru"){
	    	chrome.storage.sync.get(["clicked"],function(result) {
	    		if (!result.clicked) {//
		    		const list = document.getElementsByClassName('ta-list')[0];
		    		list.insertAdjacentHTML('beforeend',`<a href='#'><i class="material-icons mtrl-launch">launch</i>Начать рассылку</a>`);
		    		list.addEventListener('click', function(e) {
						let numbs = document.querySelectorAll("#DataTables_Table_0 > tbody > tr.selected");
						let arrNumbs = Array.from(numbs,(e)=>{ 
							if (typeof e.querySelector('.phone > a')==='object'&&e.querySelector('.phone > a')!==null) {
								return e.querySelector('.phone > a').innerText.replace(/[^0-9]/gm,'');
							} else {
								return false;
							}
						}); 
						console.log(arrNumbs);
						chrome.storage.sync.set({clicked:true},()=>{
							chrome.storage.sync.set({mailingNumbs:arrNumbs},(result)=>{
								chrome.runtime.sendMessage();//??????????????
							});
						});
						
		    		});

	    		}
	    	});
	   	const config = {
	   		attributes: true,
	   		childList: true,
	   		subtree: true
		};
		const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    		const tel = 123;
    		//create mailing uri
    		const  observerCallback = function(mutationsList, observer) {
    			mutationsList.forEach((mutation)=>{
    				try{
    					getToken();
    					console.log(`3`);
    					//TO DO rework to another all selectors or classes here, too buggy
    					const telUrl = document.getElementsByClassName("dropdown-menu")[0];
    					if (telUrl) {
    						try{
    							const myElem= telUrl.children[0].children[0].children[0].children[0];
                    			const el = document.getElementById("deleteElem");
                    			const myElemChildren = myElem.children[0];
                    			if(myElem&&!el){
    								console.log(`4`);
                        			myElem.insertAdjacentHTML('afterend', `<li id='deleteElem'><a href='https://web.whatsapp.com/send?phone=${tel}&text&app_absent=0' target='_blank'>Написать в WhatsApp</a></li>`);
                    			}
    						}catch(e){
    							console.log(`second condition ${e}`);
    						}
    					}
    				}catch(e){
    					console.log(`first condition ${e}`);
    				}
    			});
    		};
    		const target = document.getElementById('page-wrapper');
    		const observer = new MutationObserver(observerCallback);
    		observer.observe(target,config);

			}


	