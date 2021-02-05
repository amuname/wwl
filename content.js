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
    let whatsappUrl = `<li id='deleteElem'><a href='https://web.whatsapp.com/send?phone=${tel}&text&app_absent=0' target='_blank'>Написать в WhatsApp</a></li>`;
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
        console.log(arrNumbs);
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
                    // const tel = document.querySelector('.phone > a').innerText.replace(/[^0-9]/gm,'');
                    if (!tokenBoolean) {
                        getToken();
                    }
                    // console.log(`3`);
                    const popOver = document.getElementsByClassName('phone-popover')[0];
                    if (popOver.children[0]) {
                        try{
                            console.log(popOver.children[0].children[0]);
                            const myElem = popOver.getElementsByTagName('ul')[0]||popOver.getElementsByClassName('entries-is-empty')[0];
                            const el = document.getElementById("deleteElem");
                            if(myElem&&!el){
                                // console.log({myElem});
                                tel = myElem.children[0].children[0].getAttribute('data-copy-text').replace(/[^0-9]/gm,'');
                                // console.log(tel);
                                if (tel.length>=11) {
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
    const target = document.getElementsByTagName('body')[0];
    const observer = new MutationObserver(observerCallback);
    observer.observe(target,config);
    chrome.runtime.onMessage.addListener((e,sender,callback)=>{
             console.log(e);
        if (!e.mailing) {
            console.log('obj');
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
                        console.warn('conected');
                        const preLoadedMessages = document.querySelectorAll('#main div[role=region]>div');//получаю все предзагруженные сообщения 
                        //(там еще 1 для подзагрузки, самое первое)
                        //далее для последнего если оно от пользователя проставляю data- артрибут, если были сообщения на странице, то ставлю -1, 
                        //если не было и пришло при нас, то 0 и от него начинаю считать
                        if (preLoadedMessages[preLoadedMessages.length-1].className.includes('message-out')||preLoadedMessages[preLoadedMessages.length-1].className.includes('message-in')) {
                            preLoadedMessages[preLoadedMessages.length-1].setAttribute('data-message-numb','-1');
                            console.log(preLoadedMessages[preLoadedMessages.length-1]);
                        }
                        // console.log(mutation.addedNodes[0].attributes.id);//врубать дополнительно обсервер для толькол мейна
                        dialogObserver.observe(document.getElementById('main'),config);
                    }
                    
                }else if (mutation.removedNodes.length>0) {
                    if (mutation.removedNodes[0].getAttribute('id')=='main') {
                        // console.log(mutation);
                        // console.log(mutation.addedNodes[0].attributes.id);//врубать дополнительно обсервер для толькол мейна
                        // dialogObserver.disconnect();
                        console.warn('diconected');
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

                    // console.log(mutation);
                    // console.log(mutation.addedNodes[0].dataset.id);
                    // console.log(mutation.addedNodes[0].innerText);//uncomment!!! 

                }
            }catch(e){
                // console.log(e);
                return 0;
            }

        });
    }
    const target = document.getElementsByTagName('body')[0];
    const observer = new MutationObserver(observerCallback);
    const dialogObserver = new MutationObserver(dialogObserverCallback);
    observer.observe(target,config);

}