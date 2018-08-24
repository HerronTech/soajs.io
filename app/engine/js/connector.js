"use strict";
/*
 common function calls ngDataAPI angular service to connect and send/get data to api
 */
function getSendDataFromServer($scope, ngDataApi, options, callback) {
	var apiOptions = {
		url: (options.url) ? options.url + options.routeName : apiConfiguration.domain + options.routeName,
		headers: {
			'Content-Type': 'application/json'
		}
	};

	if (Object.hasOwnProperty.call(options, 'token')) {
		apiOptions.token = options.token;
	}
	else {
		apiOptions.token = true;
	}

	if (options.jsonp) {
		apiOptions.jsonp = true;
	}

	if (options.params) {
		apiOptions.params = options.params;
	}

	if (options.data) {
		apiOptions.data = options.data;
	}

	if (options.method) {
		apiOptions.method = options.method;
	}

	if (options.responseType) {
		apiOptions.responseType = options.responseType;
	}

	if (options.upload) {
		apiOptions.upload = options.upload;
		if (options.file) {
			apiOptions.file = options.file;
		}
	}

	if (options.headers) {
		for (var i in options.headers) {
			if (options.headers.hasOwnProperty(i)) {
				if (options.headers[i] === null) {
					delete apiOptions.headers[i];
				}
				else {
					apiOptions.headers[i] = options.headers[i];
				}
			}
		}
	}

	ngDataApi[options.method]($scope, apiOptions, callback);
}

/*
 common function mostyly used by grids. loops over all selected records and calls getSendDataFromServer to send/get data to api
 */
function multiRecordUpdate(ngDataApi, $scope, opts, callback) {
	var err = 0, valid = [];
	var referenceKeys = [];
	var options = angular.copy(opts);
	var fieldName = (opts.override && opts.override.fieldName) ? options.override.fieldName : "_id";
	var token = (opts.override && opts.override.fieldName) ? "%" + options.override.fieldName + "%" : "%id%";
	var baseRoute = options.routeName;
	var method = options.method || 'get';
	var grid = $scope.grid;
	if (opts.grid) {
		grid = opts.grid;
	}
	for (var i = grid.rows.length - 1; i >= 0; i--) {
		if (grid.rows[i].selected) {
			referenceKeys.push(grid.rows[i][fieldName]);
		}
	}

	performUpdate(referenceKeys, 0, function () {
		if ($scope.alerts) {
			if (err > 0) {
				$scope.alerts.push({
					'type': 'danger',
					'msg': opts.msg.error
				});
			}
			if (err < referenceKeys.length) {
				$scope.alerts.push({
					'type': 'success',
					'msg': opts.msg.success
				});
			}
			$scope.closeAllAlerts();
		}
		if (callback) {
			callback(valid);
		}
	});

	function performUpdate(referenceKeys, counter, cb) {
		var oneRoute = angular.copy(baseRoute);
		var oneValue = referenceKeys[counter];
		if (opts.routeParam) {
			oneRoute = oneRoute.replace(token, oneValue);
		}
		else {
			if (opts.params) {
				for (var i in opts.params) {
					if (opts.params[i] === token) {
						options.params[i] = referenceKeys[counter];
						if (opts.override && opts.override.fieldReshape) {
							options.params[i] = opts.override.fieldReshape(opts.params[i]);
						}
					}
				}
			}

			if (opts.data) {
				for (var i in opts.data) {
					if (opts.data[i] === token) {
						options.data[i] = referenceKeys[counter];
						if (opts.override && opts.override.fieldReshape) {
							options.data[i] = opts.override.fieldReshape(opts.data[i]);
						}
					}
				}
			}
		}

		var sendOptions = {
			"method": method,
			"headers": options.headers,
			"routeName": oneRoute,
			"params": options.params,
			"data": options.data,
			"url": options.url
		};

		if (opts.proxy) {
			sendOptions.proxy = opts.proxy;
		}

		getSendDataFromServer($scope, ngDataApi, sendOptions, function (error, response) {
			if (error || !response) {
				err++;
			}
			else {
				valid.push(referenceKeys[counter]);
			}

			counter++;
			if (counter < referenceKeys.length) {
				performUpdate(referenceKeys, counter, cb);
			}
			else {
				return cb();
			}
		});
	}
}