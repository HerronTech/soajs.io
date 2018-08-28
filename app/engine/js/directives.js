"use strict";

/**
 * This directive provides support to trigger confirm dialog box when using angular ng-click instead of default onclick event
 */
app.directive('ngConfirmClick', [
	function () {
		return {
			priority: -1,
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('click', function (e) {
					var message = attrs.ngConfirmClick;
					if (message && !confirm(message)) {
						e.stopImmediatePropagation();
						e.preventDefault();
					}
				});
			}
		}
	}
]);

/**
 * parse appDirectives from config file and generate all requested directives of type element
 */
if (appDirectives && Object.keys(appDirectives).length > 0) {
	for (let oneDirective in appDirectives) {
		if (appDirectives[oneDirective].name && appDirectives[oneDirective].name !== '') {
			if (appDirectives[oneDirective].template && appDirectives[oneDirective].template !== '') {
				
				app.directive(appDirectives[oneDirective].name, function () {
					return {
						restrict: 'E',
						templateUrl: appDirectives[oneDirective].template
					}
				});
			}
		}
	}
}
