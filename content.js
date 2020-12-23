    const config = {
        childList: true,
        subtree: true
    };

    if (window.location.host == "app.syncrm.ru") {

        var idForPost;
        let observer = new MutationObserver(function(mutationsList, observer){
            mutationsList.forEach((mutation)=>{
                let telUrl = document.getElementsByClassName("webui-popover")[0];
                if (telUrl!== undefined){
                    let myElem= telUrl.children[0].children[0].children[0].children[0];
                    let el = document.getElementById("deleteElem");
                    let myElemChildren = myElem.children[0]
                    if(myElem!==undefined&&el===null){
                        myElem.insertAdjacentHTML("afterend", "<li id='deleteElem'><a href='https://web.whatsapp.com/send?phone="+tel+"&text&app_absent=0' target='_blank'>Написать в WhatsApp</a></li>");
                    } 
                }
            })
        });
        let target = document.getElementsByTagName("body")[0];
        let tel;
        target.addEventListener("mouseover",function (e){
            var phoneURL = e.target.dataset.source;
            if(e.target.classList.value == "popover-trigger"||e.target.classList.value == "small popover-trigger"&&phoneURL!==undefined){
                var triggerSymbol = e.target.dataset.source[38];
                    if(triggerSymbol!=="("){
                        console.log(e.target.dataset.source.length);
                        let mobileURL = phoneURL;
                        let mobile = mobileURL.substr(37,11);
                        console.log(mobile+" mobile");
                        tel = mobile;
                    }
                    else  {
                        console.log(e.target.dataset.source.length);
                        let HomePhoneURL = phoneURL;
                        let HomePhone = HomePhoneURL[37]+HomePhoneURL.substr(39,3)+HomePhoneURL.substr(43,7);
                        console.log(HomePhone+" HomePhone");
                        tel = HomePhone;
                    }
            }
        })

        observer.observe(target,config)
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
