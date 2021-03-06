"use strict";
/**
 * Custom configuration values
 */

//set the application domain
let myApplicationDomain = "soajs.io";

//set the api domain
let mydomainAPI = "cloud-api";

//set the key
let myKey = "9b96ba56ce934ded56c3f21ac9bdaddc8ba4782b7753cf07576bfabcace8632eba1749ff1187239ef1f56dd74377aa1e5d0a1113de2ed18368af4b808ad245bc7da986e101caddb7b75992b14d6a866db884ea8aee5ab02786886ecf9f25e974";
if(customSettings && customSettings.key && customSettings.key !== ''){
	myKey = customSettings.key;
}

//list of dependency modules the angular app should require from components
let appModules = ['ui.bootstrap', 'ngRoute', 'ngCookies', 'ngStorage', 'youtube-embed', 'vcRecaptcha', 'ui.ace'];

//optional list of global directives to use
let appDirectives = {
	header: {
		name: 'appHeader',
		template: "custom/theme/default/directives/header.tmpl"
	},
	topMenu: {
		name: "appTopMenu",
		template: "custom/theme/default/directives/topMenu.tmpl"
	},
	footer: {
		name: "appFooter",
		template: "custom/theme/default/directives/footer.tmpl"
	},
	overlay: {
		name: "overlay",
		template: "custom/theme/default/directives/overlay.tmpl"
	}
};

//google recaptcha public key
const sitekey = "6LfrQsYZAAAAALSeInG4jeGTDQ-hVlQ6lRI7M7bv";

let cloudUri = window.location.protocol + '//cloud.' + myApplicationDomain + "/";