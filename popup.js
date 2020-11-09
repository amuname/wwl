window.onload = function(){

	var winPrefs = document.querySelector(".win-prefs");
	var winAuth = document.querySelector(".win-auth");
	var winMenu = document.querySelector(".win-menu");
	var backButt = document.querySelectorAll(".back");
	var APItoken = document.querySelector("input[name=token]");
	var submit = document.querySelector("input[name=submit]");
	var confirmCheck = document.querySelector("input[name=savecheck]");
	var login = document.querySelector("input[name=login]");
	var password = document.querySelector("input[name=password]");
	var clearStorage = document.querySelector(".clear");
	var sucToken = document.querySelector(".token-success");
	var xhr = new XMLHttpRequest();
	var LVal;
	var PVal;
	var CrmAPI;

	chrome.storage.sync.get(["LogIn"], function(result) {
	        // console.log('Value currently is ' + result.LogIn);
	        LVal = result.LogIn;
	        });
	chrome.storage.sync.get(["Pass"], function(result) {
	        // console.log('Value currently is ' + result.Pass);
	        PVal = result.Pass;
	        });
	chrome.storage.sync.get(["APl"], function(result) {
         	// console.log('Value currently is ' + result.APl);
          	CrmAPI = result.APl;
        }); 

	function WrongReg() {
		password.classList.add("wrong-reg");
		login.classList.add("wrong-reg");
	}

	function RegBack() {
		password.classList.remove("wrong-reg");
		login.classList.remove("wrong-reg");
	}

	function wrongAPI() {
		APItoken.classList.add("wrong-reg");
	}

	function backAPI() {
		APItoken.classList.remove("wrong-reg");
	}

	function toLogMenu() {
		sucToken.style.display = "none";
		winMenu.style.display = "none";
		winAuth.style.display = "block";
		submit.removeEventListener("click",GetAPIKey);
	}

	function regFunc() {	
		if (login.value!=="" &&password.value!==""||login.value!==""||password.value!=="") {
				
				if (LVal == undefined && PVal == undefined) {
					
					LVal = login.value;
					PVal = password.value;
					chrome.storage.sync.set({LogIn: LVal}/*, function() {
			          console.log('LogIn: ' + LVal);
			        }*/);
			        chrome.storage.sync.set({Pass: PVal}/*, function() {
			          console.log('Pass: ' + PVal);
			        }*/);
				} 
				else if (LVal !== login.value && PVal !== password.value||LVal !== login.value||PVal !== password.value) {
					WrongReg();
				}
				else if (LVal == login.value && PVal ==password.value) {
					winAuth.style.display = "none";
					winMenu.style.display = "block";
					submit.addEventListener("click",GetAPIKey);
				}
		}else {
			WrongReg();
		}
	}

	function GetAPIKey() {
		
		if (APItoken.value !==""&&APItoken.value.length ==64) {
			var token = APItoken.value;

			xhr.open("GET","https://app.syncrm.ru/api/v1/profile");
			xhr.setRequestHeader("Content-Type","application/vnd.api+json");
			xhr.setRequestHeader("Authorization","Bearer "+token);
			xhr.onload = (response)=>{
				// console.log('DONE: ', xhr.status);
				if (xhr.status ==200) {
					chrome.storage.sync.set({APl: token}, function() {
	          		//console.log(response);
	        		});
	        		successToken();
				}else {
					wrongAPI();
				}
			}
			xhr.send();
		} else{
			wrongAPI();
		}	

	}

	function successToken() {
		winMenu.style.display = "none";
		sucToken.style.display = "block";
		//setTimeout(window.close(),2000);
	}

	login.addEventListener("focus",RegBack);

	password.addEventListener("focus",RegBack);

	APItoken.addEventListener("focus",backAPI);

	clearStorage.addEventListener("click",()=>{
		chrome.storage.sync.remove("APl",()=>{
			console.log("Removed API")
		})
		chrome.storage.sync.remove("LogIn",()=>{
			console.log("Removed LogIn")
		})
		chrome.storage.sync.remove("Pass",()=>{
			console.log("Removed Pass")
		})
	});

	confirmCheck.addEventListener("click",regFunc);

	for(var backButton of backButt){
	backButton.addEventListener("click",toLogMenu);
	}

}