/**
 * Created by elianenassif on 8/27/18.
 */

/*
 common function
 */
function invokeApi($scope, ngDataApi, options, callback) {
	options.headers = {};
	getSendDataFromServer($scope, ngDataApi, options, callback);
}