angular.module('ZeroVidzUser').controller('MainCtrl', ['$scope','$sce',
	function($scope,$sce) {

		$scope.init = function(){
			$scope.onOpenWebSocket();
			$scope.navigation = [
				{label:'Home',section:'home'},
				{label:'About Me',section:'about'},
				{label:'My Videos',section:'videos'},
				{label:'Upload Video',section:'upload'}
			];
			$scope.section = 'home';
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

	    // select user
	    $scope.selectUser = function(){
	    	Page.cmd("certSelect", [["zeroid.bit"]]);
	    };

		// navigate
		$scope.navigate = function(section){
			$scope.section = section;
		};

		// file reader instance
		var reader = new FileReader();

		// show preview image
		$scope.showPreviewImage = function(file){
		    reader.onload = function(){
				var dataURL = reader.result;
				$scope.previewImage = dataURL;
				$scope.$apply();
		    };
		    reader.readAsDataURL(file);
		};

		// my videos 
		$scope.myVideos = function(){
			// get file
			Page.cmd("fileGet", { "inner_path": "data.json", "required": false },function(data) {
	        	// data
				if (data) { data = JSON.parse(data); }
				$scope.videos = data.videos;
				$scope.$apply();
		    });
		};

	}
]);