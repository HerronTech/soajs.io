"use strict";

/**
 * define directive <app-header></app-header> as angular module requires it
 */
if(appDirectives.header && appDirectives.header !== ''){
	app.directive('appHeader', function () {
		return {
			restrict: 'E',
			templateUrl: appDirectives.header
		}
	});
}

/**
 * define directive <app-top-menu></app-top-menu> as angular module requires it
 */
if(appDirectives.topMenu && appDirectives.topMenu !== '') {
	app.directive('appTopMenu', function () {
		return {
			restrict: 'E',
			templateUrl: appDirectives.topMenu
		}
	});
}

/**
 * define directive <app-footer></app-footer> as angular module requires it
 */
if(appDirectives.footer && appDirectives.footer !== '') {
	app.directive('appFooter', function () {
		return {
			restrict: 'E',
			templateUrl: appDirectives.footer
		}
	});
}