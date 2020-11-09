window.onload= function(){
    var CrmAPI;

    chrome.storage.sync.get(["APl"], function(result) {
          console.log('Value currently is ' + result.APl);
          CrmAPI = result.APl;
        });
    if (window.location.host == "app.syncrm.ru") {






    const target = document.getElementsByTagName("body")[0];
    let tel;
    target.addEventListener("mouseover",function (e){
        var phoneURL = e.target.dataset.source;
        if(e.target.classList.value == "popover-trigger"||e.target.classList.value == "small popover-trigger"&&phoneURL!==undefined){
            var triggerSymbol = e.target.dataset.source[38];// символ скобка - ( если домашний или число если мобильный
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
    
    const config = {
        childList: true,
        subtree: true
    };

    const observer = new MutationObserver(function(mutationsList, observer){
        mutationsList.forEach((mutation)=>{
            let telUrl = document.getElementsByClassName("webui-popover")[0];

            if (telUrl!== undefined){
                let myElem= telUrl.children[0].children[0].children[0].children[0];// на некоторых telUrl не работает тк до них путь дальше, надо в следующем условии добавить условие о проверке на undefined
                let el = document.getElementById("deleteElem");
                let myElemChildren = myElem.children[0]
                if(myElem!==undefined&&el===null/*&&el===undefined&&myElem!=el*/){
                    //console.log(el)
                    myElem.insertAdjacentHTML("afterend", "<li id='deleteElem'><a href='https://wa.me/"+tel+"' target='blank'>Написать в WhatsApp</a></li>");
                    //console.log(myElem.parentElement.innerHTML); https://web.whatsapp.com/send?phone=79681217658&text=Добрый%20день&app_absent=0
                } 
            }
        })
    });
    observer.observe(target,config)





}
if (window.location.host == "api.whatsapp.com"){

//сюда писать отключение редиректа в приложение и авто клики до ватсапа

}
 

if (window.location.host == "web.whatsapp.com") {
    var target = document./*getElementById("main");*/getElementsByClassName("app-wrapper-web font-fix os-win")[0].lastChild.lastChild

    var config = {
        childList: true,
        subtree: true
    };

    var msg;
    var responsible;//ответственный сюда чтоб не запрашивать постоянно

    var observer = new MutationObserver(function(mutationsList, observer){
        mutationsList.forEach((mutation)=>{ 
            var msgNode = document.querySelectorAll(".selectable-text.invisible-space.copyable-text");
            var pos = msgNode.length-1
            var oldMsg = msgNode[pos];
            if (oldMsg !== msg) {// вот здаесь запросить данные об ответственном
                msg = oldMsg;
                console.log(msg.textContent);
                console.log(msg.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
                var msgSender = msg.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.value;
                var senderString = msg.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id");
                var senderBoolean = senderString.substr(0, 5)
                var senderNumber;
                if (senderBoolean == "true_") {
                    senderNumber = senderString.substr(5, 11);
                }else{
                    senderNumber = senderString.substr(6, 11);
                }
                console.log(senderNumber);
                var myMsg;

                if (msgSender ==="message-in") {//дописать на входящие и исходящие после получения ответственного, того что общается с клиентом
                    myMsg = "" + msg 
                } else{
                    myMsg = "" + msg 
                }
            }
        })

    });

    observer.observe(target,config)

}

}