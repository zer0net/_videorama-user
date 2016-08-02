angular.module('ZeroVidzUser').directive('myChannel', ['$sce','$location',
	function($sce,$location) {

		var controller = function($scope,$element) {

			// file reader instance
			var reader = new FileReader();

			// init
			$scope.init = function () {

				// dropzone config
				$scope.dropzoneConfig = {	
				    'options': { // passed into the Dropzone constructor
				      'url': 'upload.php'
				    },
					'eventHandlers': {
						'sending': function (file, xhr, formData) {
							$scope.file = file;
							$scope.channel.img = file.name;
							$scope.showPreviewImage(file);
						}
					}
				};
				$scope.mode = 'view';
				$scope.getChannelInfo();

			};

			// get channel info
			$scope.getChannelInfo = function() {
				Page.cmd("fileGet", { "inner_path": "data/data.json", "required": false },function(data) {
		        	// data
					if (data) { 
						data = JSON.parse(data); 
						$scope.channel = data.channel;
						$scope.$apply();
					}
			    });
			};

			// edit mode 
			$scope.editChannel = function () {
				$scope.mode = 'edit';
			};

			// cancel edit channel
			$scope.cancelEditChannel = function() {
				$scope.mode = 'view';
			};

			// show preview image
			$scope.showPreviewImage = function(file){
				reader.onload = function(){
					// file url
					var dataURL = reader.result;
					var src = $sce.trustAsResourceUrl(dataURL);
					$scope.imgSrc = dataURL;
					// apply to scope
					$scope.$apply();
				};
				reader.readAsDataURL(file);
			};

			// save channel details
			$scope.saveChannelDetails = function() {
				if ($scope.file) {
					$scope.uploadPreviewImage();
				} else {
					$scope.updateChannel();
				}
			};

			// upload preview image
			$scope.uploadPreviewImage = function(){
			    var path = 'uploads/images/' + $scope.channel.img;
			    var canvas =  document.getElementById('canvas');
			    var previewImgUrl = $scope.imgSrc.split(',')[1];
				Page.cmd("fileWrite",[path, previewImgUrl], function(res) {
					if (res === 'ok'){
						$scope.updateChannel();
					}
				});
			};

			// update channel
			$scope.updateChannel = function() {
	    		var inner_path = 'data.json';
				Page.cmd("fileGet", { "inner_path": "data/data.json", "required": false },function(data) {
					console.log('saved');
		        	// data
					if (data) { 
						data = JSON.parse(data);
					}
					data.channel = $scope.channel;
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
					// write to file
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						Page.cmd("wrapperNotification", ["done", "Channel Updated!", 10000]);
						$scope.mode = 'view';
						$scope.$apply();
					});
			    });
			};

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);