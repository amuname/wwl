let tokenBoolean = false;
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
getToken();
const alertWindow = ()=>{//make alert Menu if token not defined
        console.log("sssssssuuukaa");
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
            chrome.storage.sync.get(["clicked"],function(result) {//rewrite this module
                if (!result.clicked) {//
                    const list = document.getElementsByClassName('ta-list')[0];
                    list.insertAdjacentHTML('beforeend',`<a href='#'><i class="material-icons mtrl-launch">launch</i>Начать рассылку</a>`);
                    list.addEventListener('click', function(e) {
                        let numbs = document.querySelectorAll("#DataTables_Table_0 > tbody > tr.selected");
                        let arrNumbs = Array.from(numbs,(e)=>{ 
                            if (typeof e.querySelector('.phone > a')==='object'&&e.querySelector('.phone > a')!==null) {
                                const num = e.querySelector('.phone > a').innerText.replace(/[^0-9]/gm,'')
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
                        chrome.storage.sync.set({clicked:false},()=>{//rewrite
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
                            try{console.log(popOver.children[0].children[0]);
                                const myElem= popOver.getElementsByTagName('ul')[0]||popOver.getElementsByClassName('entries-is-empty')[0];
                                const el = document.getElementById("deleteElem");
                                if(myElem&&!el){
                                        // console.log({myElem});
                                        const tel = myElem.children[0].children[0].getAttribute('data-copy-text').replace(/[^0-9]/gm,'');
                                        // console.log(tel);
                                        if (tel.length>=11) {
                                            myElem.insertAdjacentHTML('beforeend', `<li id='deleteElem'><a href='https://web.whatsapp.com/send?phone=${tel}&text&app_absent=0' target='_blank'>Написать в WhatsApp</a></li>`);
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

            } 
if (window.location.host == "web.whatsapp.com") {
    
    var targetwassup,
    msgL,
    msg="",
    senderNumber,
    msgNode,
    myMsg="";

    function sendToBgMSG(clientMessage, clientNumber) {
        chrome.runtime.sendMessage(msgL);
        console.log("msgL before send "+msgL);
        msgl=null;
        chrome.runtime.sendMessage(clientMessage+clientNumber);
        myMsg="";
    }

    function elemListEdit(){
        if (msg.classList.value.includes("message-in")) {
            msgL= parseInt(msgL)+5;
            console.log("msgL "+msgL);
        }
        for(let realMessageFromArr of msgNode){
            if(realMessageFromArr.classList.contains("message-in")|| realMessageFromArr.classList.contains("message-out")){
                var msgSender = realMessageFromArr.classList.value;// rewor
                var senderString = realMessageFromArr.getAttribute("data-id");
                var senderBoolean = senderString.substr(0, 5)
                       
                if (msgSender.includes("message-in")) {
                    myMsg = myMsg+" <p>" + "Клиент: " + realMessageFromArr.textContent.slice(0,-5)+"  "+realMessageFromArr.textContent.slice(-5);
                } else{
                    myMsg = myMsg +" <p>" + "Я: " + realMessageFromArr.textContent.slice(0,-5)+"  "+realMessageFromArr.textContent.slice(-5);
                }
            }
        }
        console.log(myMsg);
        return myMsg;
    }
    function phNumber(){
            if(document.querySelectorAll("div [role=region]")[1].lastChild!==undefined){
                let lastMsg = document.querySelectorAll("div [role=region]")[1].lastChild
                var senderString = lastMsg.getAttribute("data-id");
                var senderBoolean = senderString.substr(0, 5)       
                if (senderBoolean == "true_") {
                    senderNumber =  senderString.substr(5, 11);                    
                } else{
                    senderNumber =  senderString.substr(6, 11);                    
                }
            }
        return senderNumber;
    }

    // let observer2 = new MutationObserver(function(mutationsList, observer){ 
        /*mutationsList.forEach((mutation)=>*/
        document.addEventListener("DOMSubtreeModified",()=>{ 
            targetwassup = document.getElementsByClassName("app-wrapper-web font-fix")[0];
            if (targetwassup.lastChild.lastChild !==undefined) {
            if (document.querySelectorAll("div [role=region]")!==undefined) {
                if (document.querySelectorAll("div [role=region]")[1]!==undefined) {
                    // var msgNodeLast = document.querySelectorAll("div [role=region]")[1].lastChild;
                    msgNode = document.querySelectorAll("div [role=region]")[1].childNodes;
                    if (document.querySelectorAll("div [role=region]")[1].lastChild !== msg ) {
                        console.log(msgNode.length);
                        // var msgText =  msgNode.textContent;
                        // ()=>{msgText.scrollIntoView({block: "center"});}
                        // msg = msgText;
                        // if (msgNode.length%2!==0) {
                            msg = document.querySelectorAll("div [role=region]")[1].lastChild;
                            if (msg.textContent!==null) {    
                                msgL = msg.textContent.length
                                console.log(msgL);
                                sendToBgMSG(elemListEdit(),phNumber());
                            }
                        // }    
                        // var msgSender = msgNode.classList.value;
                        // //console.log(msgSender);
                        // //console.log(msg);
                        // var senderString = msgNode.getAttribute("data-id");
                        // var senderBoolean = senderString.substr(0, 5)
                        // if (senderBoolean == "true_") {
                        //     senderNumber = senderString.substr(5, 11);
                        // }else{
                        //     senderNumber = senderString.substr(6, 11);
                        // }
                        // //console.log(senderNumber);
                        
                        // if (msgSender.includes("message-in")==true) {//дописать на входящие и исходящие после получения ответственного, того что общается с клиентом
                        //     myMsg = "Клиент: " + msg.slice(0,-5)+"  "+msg.slice(-5);
                        //     sendToBgMSG(myMsg,senderNumber);
                        // } else{
                        //     myMsg = "Я: " + msg.slice(0,-5)+"  "+msg.slice(-5);
                        //     sendToBgMSG(myMsg,senderNumber);
                        // }
                        //console.log(myMsg)
                    /*if (msgNode.querySelector("div [role=button]").firstChild!==null)//какое условие прописать чтоб работало и не пролетало после первого условия
                     console.log(msgNode.querySelector("div [role=button]").firstChild);
                    console.log(msgNode.querySelector("div [role=button]"));
                    if (msgNode.querySelector("div [role=button]")!== null) {
                        if (msgNode.querySelector("div [role=button]").firstChild!== null) {
                        var blob = msgNode.querySelector("div [role=button]").firstChild.lastChild.lastChild;
                          if (blob !== imgMsg) {
                             imgMsg = blob;
                           console.log(blob);
                             console.log(blob.getAttribute("src"));
                      }
                        }
                    }*/
                   }               
                }
             }
         }
        })

    }/*);*/

    // observer2.observe(targetwassup,config);   
    
    // инструкции для обработки ошибок
    // console.log(observer2); // передать объект исключения обработчику ошибок

// }