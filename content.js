let tokenBoolean = false,
mailingStatus = false;
const getToken = ()=>{
    chrome.storage.sync.get(["APl"], function(result) {
        if (!result.APl){
            tokenBoolean = false;
            alertWindow();
        }else{
            tokenBoolean = true;
        }
    })
};

const config = {
    attributes: true,
    childList: true,
    subtree: true
};

const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

getToken();


const alertWindow = ()=>{//make alert Menu if token not defined
    if (!document.getElementById('wwl-1.7.1')){
        const alert = document.createElement('div');
        alert.style.position = 'fixed';
        alert.style.bottom = '3em';
        alert.style.right = '5em';
        alert.style.zIndex = '999';
        alert.style.opacity= '0.2';
        alert.style.transition = 'all .2s ease-out';
        alert.insertAdjacentHTML('beforeend',`<div id="wwl-1.7.1"; style="font-family: inherit;cursor: pointer;"><div style="padding: 5px;background: linear-gradient(0.26turn,#43d854,blue);"><div style="background-color: #fff;color: #7F7F7F;padding: 17px;">
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
}
 //if token defined starting main(content) script
if (window.location.host == "app.syncrm.ru"){
    let tel ="";
    let whatsappUrl;
    let mailingButton = `<a id='w-w-l-mailing'><i class="material-icons mtrl-launch">launch</i>Начать рассылку</a>`;
    const contentMessage = (contntMsg)=> {
        chrome.runtime.sendMessage({'mailing':true,'numbs':contntMsg});
        mailingStatus = true;
        // document.getElementsByClassName('ta-list')[0].replaceChild(document.getElementById('w-w-l-mailing'),`<a id='w-w-l-mailing' href='#'><i class="material-icons mtrl-launch">launch</i>Идет рассылка</a>`);
        removeListener();
    };
    const eventListener = (e)=>{
            let numbs = document.querySelectorAll("#DataTables_Table_0 > tbody > tr.selected");
            let arrNumbs = Array.from(numbs,(e)=>{ 
            if (typeof e.querySelector('.phone > a')==='object'&&e.querySelector('.phone > a')!==null) {
                const num = e.querySelector('.phone > a').innerText.replace(/[^0-9]/gm,'');
                if (num.length>=11) {
                    return num;
                }else {
                    return false;                            
                }
            } else {
                return false;                            
            }
        }); 
        // console.log(arrNumbs);
        contentMessage(arrNumbs)// тут поставить в функцию eventListener котороая будет вызывать отключение eventListener 
    };
    const removeListener = ()=>{
        whatsappUrl = `<li id='deleteElem'><span>Идет рассылка</span></li>`;
        document.getElementById('w-w-l-mailing').removeEventListener('click', eventListener)
    };
    const onMessageCallback = ()=>{
        whatsappUrl = `<li id='deleteElem'><a href='https://web.whatsapp.com/send?phone=${tel}&text&app_absent=0' target='_blank'>Написать в WhatsApp</a></li>`;
        document.getElementById('w-w-l-mailing').addEventListener('click', eventListener);    
    }
    if (!mailingStatus) {//вынести в отдельную функцию и вызывать на onMessage на разрешение рассылки
        const list = document.getElementsByClassName('ta-list')[0];
        list.insertAdjacentHTML('beforeend', mailingButton);
        onMessageCallback();
    }


        //create mailing uri
        const  observerCallback = function(mutationsList, observer) {
            mutationsList.forEach((mutation)=>{
                try{
                    if (!tokenBoolean) {
                        getToken();
                    }
                    // console.log(`3`);
                    const popOver = document.getElementsByClassName('phone-popover')[0];
                    if (popOver.children[0]) {
                        
                        try{
                            const myElem = popOver.getElementsByTagName('ul')[0]||popOver.getElementsByClassName('entries-is-empty')[0];
                            const el = document.getElementById("deleteElem");
                            if(myElem&&!el){
                                // console.log({myElem});
                                // const cond1 = document.getElementsByClassName('hover-active')[0].children[1].innerText.replace(/[^0-9]/gm,'');
                                // const cond2 = myElem.children[0].children[0].getAttribute('data-copy-text').replace(/[^0-9]/gm,'');
                                if (tel.length>=11) {
                                    whatsappUrl = `<li id='deleteElem'><a href='https://web.whatsapp.com/send?phone=${tel}&text&app_absent=0' target='_blank'>Написать в WhatsApp</a></li>`
                                    myElem.insertAdjacentHTML('beforeend', whatsappUrl);
                                }
                            }
                        }catch(e){
                            // console.log(`second condition ${e}`);
                            return 0;
                        }
                    }
                }catch(e){
                    // console.log(`first condition ${e}`);
                    return 0;
                }
            });
        };
    document.addEventListener('mouseover',(e)=>{
        if (e.target.className.includes('popover-trigger')) {
            if (e.target.dataset.mode='phone') {
                if (e.target.className.includes('small')) {
                    const str = e.target.innerText.replace(/[^0-9]/gm,'')
                    tel = str.slice(-str.length-5,11);
                }else{
                    tel = e.target.innerText.replace(/[^0-9]/gm,'');
                }
                // console.log(tel);
                // if (tel.length<11) {
                //     console.log(e.target)
                // }
            }
        }
    });
    const target = document.getElementsByTagName('body')[0];
    const observer = new MutationObserver(observerCallback);
    observer.observe(target,config);
    chrome.runtime.onMessage.addListener((e,sender,callback)=>{
             // console.log(e);
        if (!e.mailing) {
            // console.log('obj');
            onMessageCallback();
        } else {
            removeListener();
        }
    });

} 

if (window.location.host == "web.whatsapp.com") {

    const  observerCallback = function(mutationsList, observer) {
        mutationsList.forEach((mutation)=>{
            try{
                // console.log(mutation)
                // console.log(mutation.addedNodes);
                if (mutation.addedNodes.length>0) {
                    // console.log('mutation');
                    if (mutation.addedNodes[0].getAttribute('id')=='main') {
                        // console.warn('connected');
                        const preLoadedMessages = document.querySelectorAll('#main div[role=region]>div');//получаю все предзагруженные сообщения 
                        //(там еще 1 для подзагрузки, самое первое)
                        const msg_block = preLoadedMessages[preLoadedMessages.length-1];

                        const msg_block_data_id = msg_block.dataset.id;
                        chrome.storage.sync.set({'LastDialogMessageDataID':msg_block_data_id},()=>{
                        	// console.log('SET TO ',msg_block_data_id)
                        })

                        //тут сразу добавляю предзагруженное сообщение тюк в не хочу его пихать, это расширение а не бот
                        //это будет служить флагом что не стоит считать его за новое сообщение при подгрузке всего списка сообщений
                        //только после врубаю второй обсервер для получения уже новых (полученных при открытом диалоге)сообщений
                        
                        dialogObserver.observe(document.getElementById('main'),config);
                    }
                    
                }else if (mutation.removedNodes.length>0) {
                    if (mutation.removedNodes[0].getAttribute('id')=='main') {
                        // console.log(mutation);
                        // console.log(mutation.addedNodes[0].attributes.id);//врубать дополнительно обсервер для толькол мейна
                        dialogObserver.disconnect();
                        console.warn('disconnected');
                    }
                    
                }
            }catch(e){
                // console.log(e);
                return 0;
            }
        });
    }
    const dialogObserverCallback =  function(mutationsList, observer) {
        mutationsList.forEach((mutation)=>{
            try{
                if (mutation.addedNodes[0].className.includes('message-out')||mutation.addedNodes[0].className.includes('message-in')) {
                   
                    const preLoadedMessages = document.querySelectorAll('#main div[role=region]>div');
                    //получаю все предзагруженные сообщения //уже не поню зачем но вроде для того чтоб игнорировать обновления предзагруженного мсг

                    const msg_block = preLoadedMessages[preLoadedMessages.length-1];
                    if (msg_block.className.includes('message-out')||msg_block.className.includes('message-in')) {
                    	const msg_block_message = msg_block.innerText;
                    	const msg_block_data_id = msg_block.dataset.id;
                    	const msg_block_number = msg_block_data_id.slice(0,4).includes('true') ? msg_block_data_id.slice(5,5+11) : msg_block_data_id.slice(6,6+11);

                        function pre_loaded_data_id (){
                           	chrome.storage.sync.get(['LastDialogMessageDataID'] , function(result) {
                                // console.log('Value is set to ' + pre_loaded_data_id);
                                if (result.LastDialogMessageDataID.includes(msg_block_data_id)) {
                                   	// console.log('include')
                                   	//если есть запись о прошлом сообщении то игнорим его в дальнейшем
                                } else {
                       				const is_customer = msg_block.className.includes('message-in');
                                    chrome.storage.sync.set({'LastDialogMessageDataID':msg_block_data_id},()=>{
                       					// console.log('Yet NICE COMMET AWESOME ',msg_block_data_id)
                                       	chrome.runtime.sendMessage({customer:is_customer,content_whatsapp_casual_message:msg_block_message,customer_number:msg_block_number})
                       				})
                                    //новое сообщение, записываем, чтоб больше новым не было
                                }
                            })
                        }
                        pre_loaded_data_id()

                    }

                }
            }catch(e){
                // console.log(e);
            }

        });
    }
    const target = document.getElementsByTagName('body')[0];
    const observer = new MutationObserver(observerCallback);
    const dialogObserver = new MutationObserver(dialogObserverCallback);
    observer.observe(target,config);

}