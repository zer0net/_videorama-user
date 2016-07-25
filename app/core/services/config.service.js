angular.module('ngZeroBlog').factory('Config', [
	function() {

		var Config = {};

		Config.getConfig = function(){
			Page.cmd("dbQuery", ["SELECT * FROM config"], function(config) {
				return function(config){
					config = config[0];
					return config;
				}
			});
		};

		return Config;
	}
]);