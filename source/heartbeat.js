var async = require('async');
var logger = require('./utils/logger');
var db = require('./db');

var beats = require('./beats');
var notifiers = require('./notifiers');


var  serverHealth={};
function heart(type, options) {
	var beat = beats[type];

	if (!beat) {
		throw new Error('missing beat type for: ' + type);
	}

	return function (callback) {
		//beat(options, callback);
		beat.call(beats, options, callback);
	};
}

function notify(type, options,req,res) {
	var notif = notifiers[type];

	if (!type) {
		throw new Error('missing notifier type for: ' + type);
	}

	return function (failures, callback) {
		async.each(failures, function (failure, callback) {
			notif(options, failure, callback);
			//res.send(failure.url);
		}, callback);
	};
}

function notification(options) {
	var notifications = Object.keys(options).map(function (k) {
		return notify(k, options[k]);
	});

	return function (failures, callback) {
		async.each(notifications, function (notification, callback) {
			notification(failures, callback);
		}, callback);
	};
}

function createResponse(results)
{
	
	var failures = results.filter(function (r) {
		return !r.success;
	}).map(e=>e.url);

	var success = results.filter(function (r) {
		return r.success;
	}).map(e=>e.url);

	return {
		"success":success,
		"failures":failures
	}
}

function job(type, array, notify,db,req,res) {
	var hearts = array.map(function (e) {
		return heart(type, e);
	});

	return function (callback) {
		async.parallel(hearts, function (err, results) {
			if (err) {
				callback(err);
				next(err);
				
			}
				
			db.insertMany(results);
		
				var failures = results.filter(function (r) {
					return !r.success;
				});
       
	
		
		
		notify(failures, callback,req,res);
		if(res.headersSent !== true)
		{
		res.send(createResponse(results));

		}

			
			

		});
	};
}

function  heartbeat(config,req,res) {
	if (!config) {
		throw new Error('config is missing');
	}

	if (!config.monitor) {
		throw new Error('config.monitor section is missing');
	}

	if (!config.notify) {
		throw new Error('config.notify section is missing');
	}

	
	var local =   db(config);
	var notify = notification(config.notify);
	var jobs = Object.keys(config.monitor).map(function (k) {
		return job(k, config.monitor[k], notify,local,req,res);
	});

	return {
		start: function () {
			(function cycle() {
				var interval = config.interval || 10000;
				
				setTimeout(cycle, interval);
				async.series(jobs, function (err) {
				
					if (err) {
						 logger.error(err);
						 next(err);
					}
				
				});
			})();
		}
	};
}

module.exports = heartbeat;
