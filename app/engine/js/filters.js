"use strict";

/**
 * filter to support sanitizing custom urls in images, videos, audio ...
 */
app.filter('trustAsResourceUrl', ['$sce', function ($sce) {
	return function (val) {
		return $sce.trustAsResourceUrl(val);
	};
}]);

/**
 * filter to support sanitizing custom html code prior to inject it as DOM element content
 */
app.filter('toTrustedHtml', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	};
}]);