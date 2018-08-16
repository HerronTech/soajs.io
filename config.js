"use strict";
/**
 * Custom configuration values
 */

let myApplicationDomain = "soajs.org";

//detect domain
if(location && location.host){
	let customDomain = location.host;
	customDomain = customDomain.split(":")[0];
	customDomain = customDomain.split(".");
	customDomain.shift();
	customDomain = customDomain.join(".");
	myApplicationDomain = customDomain;
}

let protocol = window.location.protocol;

//detect port
let mydomainport = (protocol ==='https:') ? 443 : 80;
if (location && location.port && parseInt(location.port) !== 80) {
	mydomainport = location.port;
}
myApplicationDomain += ":" + mydomainport;

//set the api domain
let mydomainAPI = "dashboard-api";
if(customSettings && customSettings.api && customSettings.api !== ''){
	mydomainAPI = customSettings.api;
}

//set the key
let myKey = "9b96ba56ce934ded56c3f21ac9bdaddc8ba4782b7753cf07576bfabcace8632eba1749ff1187239ef1f56dd74377aa1e5d0a1113de2ed18368af4b808ad245bc7da986e101caddb7b75992b14d6a866db884ea8aee5ab02786886ecf9f25e974";
if(customSettings && customSettings.key && customSettings.key !== ''){
	myKey = customSettings.key;
}

let apiConfiguration = {
	domain: window.location.protocol + '//' + mydomainAPI + '.' + myApplicationDomain,
	key: myKey
};

//angular needs the list of domains that the app communicates with if not same as app domain
let whitelistedDomain = ['localhost', '127.0.0.1', mydomainAPI + '.' + myApplicationDomain];