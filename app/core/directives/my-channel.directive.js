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
				$scope.inner_path = 'data/channel.json';
				$scope.mode = 'view';
				$scope.getChannelInfo();
			};

			// get channel info
			$scope.getChannelInfo = function() {
				Page.cmd("fileGet", { "inner_path": $scope.inner_path, "required": false },function(data) {
					$scope.$apply(function() {
			        	// data
						if (data){
							data = JSON.parse(data);
							$scope.channel = data.channel;
						} else {
							$scope.channel = {
								name:'My Channel',
								description:'No description yet!'
							};
						}
					});
			    });
			};

			// toggle scope mode
			$scope.toggleScopeMode = function() {
				if ($scope.mode === 'edit'){
					$scope.mode = 'view';
				} else {
					$scope.mode = 'edit';
				}
			};

			// show preview image
			$scope.showPreviewImage = function(file){
				// reader on load
				reader.onload = function(){
					// apply to scope
					$scope.$apply(function() {
						// file url
						var dataURL = reader.result;
						var src = $sce.trustAsResourceUrl(dataURL);
						// temp scope var
						$scope.imgSrc = dataURL;
					});
				};
				reader.readAsDataURL(file);
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

			// save channel details
			$scope.saveChannelDetails = function() {
				$scope.loading = true;
				if ($scope.file){
					$scope.uploadPreviewImage();
				} else {
					$scope.updateChannel();
				}
			};

			// update channel
			$scope.updateChannel = function() {
				Page.cmd("fileGet", { "inner_path": $scope.inner_path, "required": false },function(data) {
					console.log('saved');
		        	// data
					if (data) { 
						data = JSON.parse(data);
					} else { 
						data = { "next_item_id":1,"videos": [] }
					};
					data.channel = $scope.channel;
					data.channel.channel_id = $scope.site_address;
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
					// write to file
					Page.cmd("fileWrite", [$scope.inner_path, btoa(json_raw)], function(res) {
						// publish site
						// Page.cmd("sitePublish",{"inner_path": $scope.inner_path}, function(res){
							// apply to scope
							$scope.$apply(function() {
								Page.cmd("wrapperNotification", ["done", "Channel Updated!", 10000]);
								$scope.mode = 'view';
								$scope.loading = false;
							});
						//});
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