angular.module('ZeroVidzUser').controller('MainCtrl', ['$scope','$sce','$location',
	function($scope,$sce,$location) {

		$scope.init = function(){
			$scope.onOpenWebSocket();
			var absUrl = $location.$$absUrl;
			$scope.site_address = absUrl.split('0/')[1].split('/')[0];
			if (absUrl.indexOf('/v/') > -1){
				$scope.section = absUrl.split('/v/')[1].split('/')[0];
			} else {
				$scope.section = 'videos';
			}
		};

		// on open web socket
	    $scope.onOpenWebSocket = function(e) {
			// site info
			Page.cmd("siteInfo", {}, (function(_this) {
				return function(site_info) {
					if (site_info.cert_user_id) {
						$scope.user = site_info.cert_user_id;
					} else {
						//$scope.selectUser();
					}

					$scope.page = Page;
					$scope.$apply();
					return _this.site_info = site_info;
				};
			})(Page));
	    };

	    // select user
	    $scope.selectUser = function(){
	    	Page.cmd("certSelect", [["zeroid.bit"]]);
	    };
	    
	}
]);