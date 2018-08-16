'use strict';
/**
 * Create New Angular Module and add dependency modules
 * @type {module}
 */
let app = angular.module('mainWebsite', ['ui.bootstrap', 'ngRoute', 'youtube-embed']);

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
	function ($routeProvider, $controllerProvider, $compileProvider,$locationProvider, $filterProvider, $provide, $sceDelegateProvider) {
		
		let whitelisted = ['self'];
		whitelisted = whitelisted.concat(whitelistedDomain);
		$sceDelegateProvider.resourceUrlWhitelist(whitelisted);
		
		app.compileProvider = $compileProvider;
		
		navigation.forEach(function (navigationEntry) {
			if (navigationEntry.scripts && navigationEntry.scripts.length > 0) {
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
app.controller('mainCtrl', ['$scope', '$location', '$routeParams', function ($scope, $location, $routeParams) {
	
	//define a global methods that builds a url compatible with angular annotation to invoke anchor links
	$scope.goToAnchor = function (section, anchor) {
		$location.path("/" + section + "/" + anchor);
	};

	//capture on route change events and invoke custom methods
	$scope.$on('$routeChangeSuccess', function (event, current, previous) {
		
		setLocalLocation(event, current, previous);
		
		setPageMetaData(event, current, previous);
		
	});
	
	
	//register local url location when a page finishes loading
	function setLocalLocation(event, current, previous){
		
		$scope.currentLocation = $location.path();
		
		let subPagesDetection = $scope.currentLocation.match(/\//g);
		if (subPagesDetection.length > 1) {
			let p = $location.path().split(/\//);
			$scope.currentLocation = "/" + p[1];
		}
		
		if ($routeParams.anchor) {
			let sp = '/' + $routeParams.anchor;
			let p = $location.path().split(sp);
			$scope.currentLocation = p[0];
		}
	}
	
	//update page title, keywords and description
	function setPageMetaData(event, current, previous){
		
		navigation.forEach((oneNavigationEntry) => {
			
			let urlOnly = oneNavigationEntry.url.replace('/:anchor?', '').replace("/:section?", '');
			if (urlOnly === $scope.currentLocation) {
				
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
			
		});
	}
}]);

