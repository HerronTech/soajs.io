'use strict';

//detect domain
if (location && location.host) {
	let customDomain = location.host;
	
	//check if port is part of the domain host location value
	if(customDomain.includes(":")){
		customDomain = customDomain.split(":")[0];
	}
	
	//check if domain host location value is a subdomain or has www
	if(customDomain.includes(".")){
		let t = customDomain.split(".");
		if(t.length > 2){
			t.shift();
			customDomain = t.join(".");
		}
	}
	myApplicationDomain = customDomain;
}

let protocol = window.location.protocol;

//detect port
let mydomainport = (protocol === 'https:') ? 443 : 80;
if (location && location.port && parseInt(location.port) !== 80) {
	mydomainport = location.port;
}
myApplicationDomain += ":" + mydomainport;

let apiConfiguration = {
	domain: protocol + '//' + mydomainAPI + '.' + myApplicationDomain,
	key: myKey
};

//angular needs the list of domains that the app communicates with if not same as app domain
let whitelistedDomain = ['localhost', '127.0.0.1', mydomainAPI + '.' + myApplicationDomain];

let interfaceDomain;
interfaceDomain = myApplicationDomain.split(":")[0];
/**
 * Create New Angular Module and add dependency modules
 * @type {module}
 */
let app = angular.module('mainWebsite', appModules);

/**
 * Add Custom Configuration binding nagivation url entries with require.js to load
 * templates ( directives ) and script files ( controller, services, custom config ... )
 */
app.config([
	'$routeProvider',
	'$controllerProvider',
	'$compileProvider',
	'$locationProvider',
	'$filterProvider',
	'$provide',
	'$sceDelegateProvider',
	function ($routeProvider, $controllerProvider, $compileProvider, $locationProvider, $filterProvider, $provide, $sceDelegateProvider) {
		
		let whitelisted = ['self'];
		whitelisted = whitelisted.concat(whitelistedDomain);
		$sceDelegateProvider.resourceUrlWhitelist(whitelisted);
		
		app.compileProvider = $compileProvider;
		
		function processOneMenuEntry(navigationEntry){
			if(navigationEntry.tplPath){
				$routeProvider.when(navigationEntry.url.replace('#', ''), {
					templateUrl: navigationEntry.tplPath,
					resolve: {
						load: ['$q', '$rootScope', function ($q, $rootScope) {
							let deferred = $q.defer();
							require(navigationEntry.scripts, function () {
								$rootScope.$apply(function () {
									deferred.resolve();
								});
							});
							return deferred.promise;
						}]
					}
				});
			}
			
			//add hook for children sub menu
			if(navigationEntry.children && Array.isArray(navigationEntry.children) && navigationEntry.children.length > 0){
				navigationEntry.children.forEach((subNavigationEntry) => {
					subNavigationEntry.entries.forEach((oneSubNavigationEntry) => {
						processOneMenuEntry(oneSubNavigationEntry);
					});
				});
			}
		}
		
		navigation.forEach((navigationEntry) => {
			if (navigationEntry.scripts && Array.isArray(navigationEntry.scripts) && navigationEntry.scripts.length > 0) {
				processOneMenuEntry(navigationEntry);
			}
			else if(navigationEntry.children && Array.isArray(navigationEntry.children) && navigationEntry.children.length > 0){
				//add hook for children sub menu
				navigationEntry.children.forEach((subNavigationEntry) => {
					subNavigationEntry.entries.forEach((oneSubNavigationEntry) => {
						processOneMenuEntry(oneSubNavigationEntry);
					});
				});
			}
			else {
				if (navigationEntry.tplPath && navigationEntry.tplPath !== '') {
					$routeProvider.when(navigationEntry.url.replace('#', ''), {
						templateUrl: navigationEntry.tplPath
					});
				}
			}
		});
		
		$routeProvider.otherwise({
			redirectTo: '/'
		});
		
		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
		
		app.components = {
			controller: $controllerProvider.register,
			filter: $filterProvider.register,
			service: $provide.service
		};
	}
]);

/**
 * Define the main application controller of this angular module
 */
app.controller('mainCtrl', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {
	$scope.appNavigation = navigation;
	
	/**
	 * method that animates scrolling to anchor location on page if anchor is in url and element is found on page
	 */
	function animateAnchorRedirections(event){
		let hash = $location.hash();
		if(hash && hash !== ''){
			$scope.currentLocationAnchor = hash;
			event.preventDefault();
			$("html,body").scrollTop(0);
			$timeout(() => {
				if ($("#" + hash)) {
					$("html,body").animate({scrollTop: $("#" + hash).offset().top}, 500);
					window.location.hash = hash;
					event.preventDefault();
				}
			}, 100);
			
		}
	}
	
	//capture on route change events and invoke custom methods
	$scope.$on('$routeChangeStart', function (event, current, previous) {
		//reset anchor value
		delete $scope.currentLocationAnchor;
	});
	
	//capture on route change events and invoke custom methods
	$scope.$on('$routeChangeSuccess', function (event, current, previous) {
		//trigger anchor animation redirection when previous page is not the same as this one
		
		
		setLocalLocation(event, current, previous);
		
		animateAnchorRedirections(event);
		
		setPageMetaData(event, current, previous);
	});
	
	
	//register local url location when a page finishes loading
	function setLocalLocation(event, current, previous) {
		$scope.currentLocation = $location.path();
	}
	
	//update page title, keywords and description and activate link based on url and anchor values
	function setPageMetaData(event, current, previous) {
		$scope.appNavigation.forEach((oneNavigationEntry) => {
			oneNavigationEntry.active = false;
			
			let entryFound = false;
			let oneLink = oneNavigationEntry.url.split("#");
			if (oneLink[0] === $scope.currentLocation) {
				if (oneLink[1] && oneLink[1] === $scope.currentLocationAnchor) {
					entryFound = true;
					activateFromLink(oneNavigationEntry)
				}
				else if (!oneLink[1]) {
					entryFound = true;
					activateFromLink(oneNavigationEntry)
				}
			}
			if(!entryFound && oneNavigationEntry.children){
				oneNavigationEntry.children.forEach((oneChildGroup) => {
					oneChildGroup.entries.forEach((oneChildEntry) =>{
						
						let oneLink = oneChildEntry.url.split("#");
						if (oneLink[0] === $scope.currentLocation) {
							if (oneLink[1] && oneLink[1] === $scope.currentLocationAnchor) {
								entryFound = true;
								activateFromLink(oneChildEntry)
							}
							else if (!oneLink[1]) {
								entryFound = true;
								activateFromLink(oneChildEntry)
							}
						}
					});
				});
			}
		});
		
		function activateFromLink(oneNavigationEntry) {
			oneNavigationEntry.active = true;
			
			if (oneNavigationEntry.title && oneNavigationEntry.title !== '') {
				jQuery('head title').html(oneNavigationEntry.title);
			}
			
			if (oneNavigationEntry.keywords && oneNavigationEntry.keywords !== '') {
				jQuery('head meta[name=keywords]').attr('content', oneNavigationEntry.keywords);
			}
			
			if (oneNavigationEntry.description && oneNavigationEntry.description !== '') {
				jQuery('head meta[name=description]').attr('content', oneNavigationEntry.description);
			}
		}
	}
	
	//method used by extended controllers to update the main parent scope.
	$scope.updateParentScope = function(name, data){
		$scope[name] = data;
	};
	
	//method used by extended controllers to remove elements from the main parent scope.
	$scope.removeFromParentScope = function(name){
		if($scope[name]){
			delete $scope[name];
		}
	};
}]);

