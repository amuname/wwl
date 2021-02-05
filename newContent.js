

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