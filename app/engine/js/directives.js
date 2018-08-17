"use strict";

/**
 * parse appDirectives from config file and generate all requested directives of type element
 */
if(appDirectives && Object.keys(appDirectives).length > 0){
	for(let oneDirective in appDirectives ){
		if(appDirectives[oneDirective].name && appDirectives[oneDirective].name !== ''){
			if(appDirectives[oneDirective].template && appDirectives[oneDirective].template !== ''){
				
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