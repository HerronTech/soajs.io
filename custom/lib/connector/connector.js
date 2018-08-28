/**
 * Created by elianenassif on 8/27/18.
 */

/*
 common function
 */

function getKeyFromCookie(name) {
	let key;
	let value = "; " + document.cookie;
	let parts = value.split("; " + name + "=");
	if (parts.length === 2) {
		key = parts.pop().split(";").shift();
	}
	return key;
}

function invokeApi($scope, ngDataApi, options, callback) {
	if (!options.headers) {
		options.headers = {};
	}
	if (!options.headers.key) {
		options.headers.key = getKeyFromCookie('ht_dashboard_key');
	}
	getSendDataFromServer($scope, ngDataApi, options, callback);
}