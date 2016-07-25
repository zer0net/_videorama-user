angular.module('ngZeroBlog').controller('MainCtrl', ['$rootScope','$scope','$sce','Config','$mdDialog','$location',
	function($rootScope,$scope,$sce,Config,$mdDialog,$location) {

		// init blog
		$scope.initBlog = function(){
		    $scope.onOpenWebSocket();
			$scope.getConfig();
		    $scope.headerClass = '';
            $scope.headerWidthLeft = '75';
            $scope.headerWidthRight = '25';
			$scope.configSectionView();
		};

		// config section & view
		$scope.configSectionView = function(){
		    var absUrl = $location.$$absUrl;
			if (absUrl.indexOf('Post:') > -1){
				$scope.loading = true;
				$scope.section = 'posts';
				$scope.layout = 'post';
			} else if (absUrl.indexOf('Admin:') > -1){
				$scope.section = 'admin';
				var section = absUrl.split('&')[0].split('Admin:')[1];
				if (section.indexOf('editP') > -1){
					$scope.adminSection = 'editPost';
				} else{
					$scope.adminSection = section;
				}
				console.log($scope.adminSection);
			} else {
				$scope.loading = true;
				$scope.section = 'posts';
				$scope.layout = 'list';
			}
		};

		// finish loading
		$scope.finishLoading = function(){
			$scope.loading = false;
		};

		// on open web socket
	    $scope.onOpenWebSocket = function(e) {
			// site info
			Page.cmd("siteInfo", {}, (function(_this) {
				return function(site_info) {
					if (site_info.cert_user_id) $scope.user = site_info.cert_user_id;
					return _this.site_info = site_info;
				};
			})(Page));
	    };

		// get config
		$scope.getConfig = function(){
			Page.cmd("dbQuery", ["SELECT * FROM config"], function(config) {
				$scope.config = config[0];
				$scope.$apply();
			});
		};

	    // select user
	    $scope.selectUser = function(){
	    	Page.cmd("certSelect", [["zeroid.bit"]]);
	    };

	}
]);