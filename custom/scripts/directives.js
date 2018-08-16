"use strict";

/**
 * define directive <top-menu></top-menu> as angular module requires it
 */
app.directive('topMenu', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/templates/topMenu.html'
	}
});
